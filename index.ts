import {Glob} from "bun";
import * as path from "node:path";
import * as os from "os";

interface Route {
    name: string;
    path: string;
    module: any;
}

const routes: { [key: string]: Route[] } = {
    get: [],
    post: [],
};

async function loadRoutes() {
    const allRoutes = new Glob("routes/*.ts");
    for await (let file of allRoutes.scan(".")) {
        console.log("Loaded route file:", file);
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
        routes.get.push({ name: rawFileName.split('.')[0], path: file, module: getModule });
        routes.post.push({ name: rawFileName.split('.')[0], path: file, module: postModule});
    }
}

async function handleRequest(req: Request): Promise<Response> {
    const start = Date.now();
    const userMethod = req.method.toLowerCase();
    const url = req.url;
    let parsedUrl = new URL(url ?? '', 'http://localhost');
    if(parsedUrl.pathname === '/favicon.ico') {
        return new Response('', { status: 204 });
    }

    if(parsedUrl.pathname === '/') {
        parsedUrl.pathname = '/index';
    }

    let matchingRoute: Route | undefined;

    for (const route of routes[userMethod]) {
        if (route.name === parsedUrl.pathname.replace('/', '')) {
            matchingRoute = route;
        }
    }

    if (!matchingRoute) {
        return new Response('Not found.', { status: 404 });
    }

    try {
        const response = await matchingRoute.module(req);
        const end = Date.now();
        response.headers.set('x-response-time', `${end - start}ms`);
        return response;
    } catch (error) {
        console.error('Error while processing the requested route: ', error);
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
