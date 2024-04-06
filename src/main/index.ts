import { Glob } from "bun";
import * as path from "path/posix";
import * as os from "os";
import chalk from "chalk";
import * as fs from "fs";
import { SendJSON, Success, Failure, ServerFailure, Redirect, Html } from "../helpers/helper.ts";
import {query} from "../helpers/query.ts";
import {param} from "../helpers/param.ts";
import MongoService from "../instances/mongodb.ts";
import PgService from "../instances/postgres.ts";

const isNotProd = process.env.NODE_ENV !== 'production';
let log = false;

interface Route {
    name: string;
    path: string;
    module: any;
}

// Methods
const get = {} as any;
const post = {} as any;
const put = {} as any;
const del = {} as any;
const patch = {} as any;

// Middlewares
const premiddlewares = [] as any;
const postmiddlewares = [] as any;

async function loadFolder(folder: string) {
    if(log) {
        console.log(`${chalk.bold.white(`Loading `)} ${chalk.bold.green(`${folder}`)}...`);
    }
    const allRoutes = new Glob(`${folder}/*.ts`);
    for await (let file of allRoutes.scan(".")) {
        file = file.replace(/\\/g, '/');
        file = file.replace(/routes\//g, '');
        const splits = file.split("/");
        const filePath = path.join(process.cwd(), 'routes', file);
        const routeModule = await import(filePath).then((m) => m.default || m);
        const getModule = typeof routeModule === 'object' ? routeModule?.GET : routeModule;
        const postModule = typeof routeModule === 'object' ? routeModule?.POST : routeModule;
        const putModule = typeof routeModule === 'object' ? routeModule?.PUT : routeModule;
        const deleteModule = typeof routeModule === 'object' ? routeModule?.DELETE : routeModule;
        const patchModule = typeof routeModule === 'object' ? routeModule?.PATCH : routeModule;
        file = file.replace(/.ts/g, '');
        if(getModule) {
            if(file.includes('[') && file.includes(']')) {
                const parts = file.split('/');
                parts[parts.length - 1] = 'params';
                file = parts.join('/');
            }
            get[`${file}`] = getModule;
        }

        if(postModule) {
            if(file.includes('[') && file.includes(']')) {
                const parts = file.split('/');
                parts[parts.length - 1] = 'params';
                file = parts.join('/');
            }
            post[`${file}`] = postModule;
        }
        if(putModule) {
            if(file.includes('[') && file.includes(']')) {
                const parts = file.split('/');
                parts[parts.length - 1] = 'params';
                file = parts.join('/');
            }
            put[`${file}`] = putModule;
        }
        if(deleteModule) {
            if(file.includes('[') && file.includes(']')) {
                const parts = file.split('/');
                parts[parts.length - 1] = 'params';
                file = parts.join('/');
            }
            del[`${file}`] = deleteModule;
        }
        if(patchModule) {
            if(file.includes('[') && file.includes(']')) {
                const parts = file.split('/');
                parts[parts.length - 1] = 'params';
                file = parts.join('/');
            }
            patch[`${file}`] = patchModule;
        }
    }
    const folders = fs.readdirSync(folder);
    for(const subfolder of folders) {
        if(subfolder.includes('.')) {
            continue;
        }
        await loadFolder(path.join(folder, subfolder));
    }
}

async function loadRoutes() {
    const start = Date.now();
    await loadFolder('routes');
    if(log) {
        console.log(`${chalk.bold.white(`Loaded all routes in`)} ${chalk.bold.green(`${Date.now() - start}ms`)}`);
    }
}

async function handleRequest(req: Request): Promise<Response> {
    const start = Date.now();
    let customHeaders = new Headers();
    for(const middleware of premiddlewares) {
        try {
            await middleware(req, { headers: customHeaders });
        } catch (error) {
            console.error(`${chalk.bold.red(`Error while processing middleware ${middleware.name}:`)} ${error}`);
            return ServerFailure('Internal Server Error');
        }
    }
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

    if(parsedUrl.pathname.endsWith('/')) {
        parsedUrl.pathname = parsedUrl.pathname.substring(0, parsedUrl.pathname.length - 1);
    }

    let matchingRoute: Route | undefined;

    if(userMethod === 'get') {
        if(isIndex) {
            matchingRoute = get['index'];
        } else {
            matchingRoute = get[parsedUrl.pathname.substring(1)];
            if(!matchingRoute) {
                matchingRoute = get[parsedUrl.pathname.substring(1) + '/index'];
            }
            if(!matchingRoute) {
                const parts = parsedUrl.pathname.split('/');
                parts.pop();
                let newPath = parts.join('/');
                newPath = newPath.substring(1);
                matchingRoute = get[newPath + '/params'];
            }
        }
    }

    if(userMethod === 'post') {
        if(isIndex) {
            matchingRoute = post['index'];
        } else {
            matchingRoute = post[parsedUrl.pathname.substring(1)];
            if(!matchingRoute) {
                matchingRoute = post[parsedUrl.pathname.substring(1) + '/index'];
            }
            if(!matchingRoute) {
                const parts = parsedUrl.pathname.split('/');
                parts.pop();
                let newPath = parts.join('/');
                newPath = newPath.substring(1);
                matchingRoute = post[newPath + '/params'];
            }
        }
    }

    if(userMethod === 'put') {
        if(isIndex) {
            matchingRoute = put['index'];
        } else {
            matchingRoute = put[parsedUrl.pathname.substring(1)];
            if(!matchingRoute) {
                matchingRoute = put[parsedUrl.pathname.substring(1) + '/index'];
            }
            if(!matchingRoute) {
                const parts = parsedUrl.pathname.split('/');
                parts.pop();
                let newPath = parts.join('/');
                newPath = newPath.substring(1);
                matchingRoute = put[newPath + '/params'];
            }
        }
    }

    if(userMethod === 'delete') {
        if(isIndex) {
            matchingRoute = del['index'];
        } else {
            matchingRoute = del[parsedUrl.pathname.substring(1)];
            if(!matchingRoute) {
                matchingRoute = del[parsedUrl.pathname.substring(1) + '/index'];
            }
            if(!matchingRoute) {
                const parts = parsedUrl.pathname.split('/');
                parts.pop();
                let newPath = parts.join('/');
                newPath = newPath.substring(1);
                matchingRoute = del[newPath + '/params'];
            }
        }
    }

    if(userMethod === 'patch') {
        if(isIndex) {
            matchingRoute = patch['index'];
        } else {
            matchingRoute = patch[parsedUrl.pathname.substring(1)];
            if(!matchingRoute) {
                matchingRoute = patch[parsedUrl.pathname.substring(1) + '/index'];
            }
            if(!matchingRoute) {
                const parts = parsedUrl.pathname.split('/');
                parts.pop();
                let newPath = parts.join('/');
                newPath = newPath.substring(1);
                matchingRoute = patch[newPath + '/params'];
            }
        }
    }

    if (!matchingRoute) {
        if(log) {
            reqMessage += ` ${chalk.bold.red('404')} ${chalk.bold.gray(`${Date.now() - start}ms`)}`;
            console.log(reqMessage);
        }
        return new Response('Not found.', { status: 404 });
    }

    try {
        // @ts-ignore
        const response = await matchingRoute(req);
        for(const middleware of postmiddlewares) {
            try {
                await middleware(req, { headers: customHeaders });
            } catch (error) {
                console.error(`${chalk.bold.red(`Error while processing middleware ${middleware.name}:`)} ${error}`);
                return ServerFailure('Internal Server Error');
            }
        }
        const end = Date.now();
        response.headers.set('x-response-time', `${end - start}ms`);
        for(const [key, value] of customHeaders) {
            response.headers.set(key, value);
        }
        if(log) {
            let color = 'green';
            if(response.status >= 100 && response.status < 200) {
                color = 'blue';
            } else if(response.status >= 200 && response.status < 300) {
                color = 'green';
            } else if(response.status >= 300 && response.status < 400) {
                color = 'yellow';
            } else if(response.status >= 400 && response.status < 500) {
                color = 'magenta';
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
        if(log) {
            reqMessage += ` ${chalk.bold.red('500')} ${chalk.bold.gray(`${Date.now() - start}ms`)}`;
            console.log(reqMessage);
        }
        return ServerFailure('Internal Server Error');
    }
}

async function startServer(port: number = 3000, routes: string = "routes", logger: boolean = true) {
    await loadRoutes();
    console.log(`Starting server on port ${port}...`);
    Bun.serve({
        port,
        fetch: handleRequest
    });
}

class ProBun {
    private port: any;
    private routes: any;
    private logger: any;
    private mongoUri: any;
    private pgConfig: any;

    constructor(props: { port: number, routes: string, logger: boolean, mongoUri?: any, pgConfig?: any}) {
        const {port, routes, logger, mongoUri, pgConfig} = props;
        this.port = port;
        this.routes = routes;
        this.logger = logger;
        this.mongoUri = mongoUri;
        this.pgConfig = pgConfig;
    }

    async start() {
        log = this.logger;
        if(this.mongoUri) {
            await MongoService.getInstance().connect(this.mongoUri);
        }
        if(this.pgConfig) {
            await PgService.getInstance().connect(this.pgConfig);
        }
        startServer(this.port, this.routes, this.logger);
    }

    definePreMiddleware(middleware: any) {
        premiddlewares.push(middleware);
        if(this.logger) {
            console.log(`Added pre-middleware: ${chalk.bold.green(middleware.name)}`);
        }
    }

    definePostMiddleware(middleware: any) {
        postmiddlewares.push(middleware);
        if(this.logger) {
            console.log(`Added post-middleware: ${chalk.bold.green(middleware.name)}`);
        }
    }
}

export {ProBun, SendJSON, Success, Failure, ServerFailure, Redirect, Html, query, param, MongoService, PgService};
