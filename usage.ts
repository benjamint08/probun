import ProBun from "./lib"
import {powered} from "./middleware/powered";
import {cors} from "./middleware/cors";

const server = new ProBun({
    port: 3001,
    routes: "routes",
    logger: true
});

server.defineMiddleware(powered);
server.defineMiddleware(cors);
server.start();