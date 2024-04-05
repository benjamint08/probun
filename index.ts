import {Glob} from "bun";
import * as path from "path/posix";
import * as os from "os";
import chalk from "chalk";
import * as fs from "fs";

const isNotProd = process.env.NODE_ENV !== 'production';

interface Route {
    name: string;
    path: string;
    module: any;
}

const get = {} as any;
const post = {} as any;

async function loadRoutes() {
    const start = Date.now();
    const allRoutes = new Glob("routes/*.ts");
    for await (let file of allRoutes.scan(".")) {
        // Windows handles files differently than Linux
        if(os.platform() === 'win32') {
            file = file.replace(/\\/g, '/');
        }
        const splits = file.split("/");
        const rawFileName = splits[splits.length - 1].split(".")[0];
        const filePath = path.join(process.cwd(), 'routes', rawFileName);
        const routeModule = await import(filePath).then((m) => m.default || m);
        const getModule = typeof routeModule === 'object' ? routeModule?.GET : routeModule;
        const postModule = typeof routeModule === 'object' ? routeModule?.POST : routeModule;
        if(getModule) {
            get[rawFileName] = getModule;
        }
        if(postModule) {
            post[rawFileName] = postModule;
        }
    }
    // get all folders and subfolders of cwd
    for (let file of fs.readdirSync(`${process.cwd()}/routes`)) {
        if(fs.lstatSync(`${process.cwd()}/routes/${file}`).isDirectory()) {
            const allRoutes = new Glob(`routes/${file}/*.ts`);
            for (let file of allRoutes.scanSync(".")) {
                // Windows handles files differently than Linux
                if(os.platform() === 'win32') {
                    file = file.replace(/\\/g, '/');
                    file = file.replace(/routes\//g, '');
                }
                const splits = file.split("/");
                const rawFileName = splits[splits.length - 1].split(".")[0];
                const filePath = path.join(process.cwd(), 'routes', file);
                const routeModule = await import(filePath).then((m) => m.default || m);
                const getModule = typeof routeModule === 'object' ? routeModule?.GET : routeModule;
                const postModule = typeof routeModule === 'object' ? routeModule?.POST : routeModule;
                file = file.replace(/.ts/g, '');
                if(getModule) {
                    get[`${file}`] = getModule;
                }
                if(postModule) {
                    post[`${file}`] = postModule;
                }
            }
        }
    }
    console.log(get)
    console.log(post)
    console.log(`${chalk.bold.white(`Loaded all routes in`)} ${chalk.bold.green(`${Date.now() - start}ms`)}`);
}

async function handleRequest(req: Request): Promise<Response> {
    const start = Date.now();
    const userMethod = req.method.toLowerCase();
    const url = req.url;
    let isIndex = false;
    let parsedUrl = new URL(url ?? '', 'http://localhost');
    let reqMessage = `${chalk.bold.white(userMethod.toUpperCase())} ${parsedUrl.pathname}`;
    if(parsedUrl.pathname === '/favicon.ico') {
        return new Response('', { status: 204 });
    }

    if(parsedUrl.pathname === '/') {
        isIndex = true;
    }

    let matchingRoute: Route | undefined;

    if(userMethod === 'get') {
        if(isIndex) {
            matchingRoute = get['index'];
        } else {
            matchingRoute = get[parsedUrl.pathname.substring(1)];
        }
    }

    if(userMethod === 'post') {
        if(isIndex) {
            matchingRoute = post['index'];
        } else {
            matchingRoute = post[parsedUrl.pathname.substring(1)];
        }
    }

    if (!matchingRoute) {
        if(isNotProd) {
            reqMessage += ` ${chalk.bold.red('404')} ${chalk.bold.gray(`${Date.now() - start}ms`)}`;
            console.log(reqMessage);
        }
        return new Response('Not found.', { status: 404 });
    }

    try {
        // @ts-ignore
        const response = await matchingRoute(req);
        const end = Date.now();
        response.headers.set('x-response-time', `${end - start}ms`);
        if(isNotProd) {
            let color = 'green';
            if(response.status >= 100 && response.status < 200) {
                color = 'blue';
            } else if(response.status >= 200 && response.status < 300) {
                color = 'green';
            } else if(response.status >= 300 && response.status < 400) {
                color = 'yellow';
            } else if(response.status >= 400 && response.status < 500) {
                color = 'purple';
            } else if(response.status >= 500) {
                color = 'red';
            }
            // @ts-ignore
            reqMessage += ` ${chalk.bold[color](response.status)}`;
            reqMessage += ` ${chalk.bold.gray(`${end - start}ms`)}`;
            console.log(reqMessage);
        }
        return response;
    } catch (error) {
        console.error('Error while processing the requested route: ', error);
        if(isNotProd) {
            reqMessage += ` ${chalk.bold.red('500')} ${chalk.bold.gray(`${Date.now() - start}ms`)}`;
            console.log(reqMessage);
        }
        return new Response('Internal Server Error', { status: 500 });
    }
}

async function startServer() {
    await loadRoutes();
    let port = 3000;
    if (Bun.env.PORT) {
        port = parseInt(Bun.env.PORT);
    }
    console.log(`Starting server on port ${port}...`);
    Bun.serve({
        fetch: handleRequest
    });
}

startServer();
