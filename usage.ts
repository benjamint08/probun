import {ProBun} from "./lib"
import {powered} from "./middleware/powered";
import {cors} from "./middleware/cors";

const server = new ProBun({
    port: 3001,
    routes: "routes",
    logger: true
});

server.definePreMiddleware(powered);
server.definePostMiddleware(cors);
server.start();