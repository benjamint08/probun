import {Glob} from "bun";

interface Route {
    name: string;
    path: string;
    module: any; // Adjust the type according to your module structure
}

const routes: { [key: string]: Route[] } = {
    get: [], // Initialize get routes as an empty array
    post: [], // Initialize post routes as an empty array
};

async function loadRoutes() {
    const getRoutes = new Glob("routes/get/*.ts");
    for await (const file of getRoutes.scan(".")) {
        console.log("Loaded get route file:", file)
        const splits = file.split("/");
        const rawFileName = splits[splits.length - 1].split(".")[0];
        const routeModule = await import(`./routes/get/${rawFileName}`).then((m) => m.default || m);
        const module = typeof routeModule === 'object' ? routeModule?.handle : routeModule;
        routes.get.push({ name: rawFileName.split('.')[0], path: file, module});
    }

    const postRoutes = new Glob("routes/post/*.ts");
    for await (const file of postRoutes.scan(".")) {
        console.log("Loaded post route file:", file)
        const splits = file.split("/");
        const rawFileName = splits[splits.length - 1].split(".")[0];
        const routeModule = await import(`./routes/post/${rawFileName}`).then((m) => m.default || m);
        const module = typeof routeModule === 'object' ? routeModule?.handle : routeModule;
        routes.post.push({ name: rawFileName.split('.')[0], path: file, module });
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

// Load routes and then start the server
async function startServer() {
    await loadRoutes();
    console.log("Starting server...");
    Bun.serve({
        fetch: handleRequest
    });
}

startServer();