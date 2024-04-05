import {Glob} from "bun";

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
    for await (const file of allRoutes.scan(".")) {
        console.log("Loaded route file:", file)
        const splits = file.split("/");
        const rawFileName = splits[splits.length - 1].split(".")[0];
        const routeModule = await import(`./routes/${rawFileName}`).then((m) => m.default || m);
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
    console.log("Starting server...");
    Bun.serve({
        fetch: handleRequest
    });
}

startServer();
