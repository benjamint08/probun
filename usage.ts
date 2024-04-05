import ProBun from "./lib"
import {powered} from "./middleware/powered";

const server = new ProBun({
    port: 3001,
    routes: "routes",
    logger: true
});

server.defineMiddleware(powered);
server.start();