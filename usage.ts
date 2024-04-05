import ProBun from "./index";

const server = new ProBun({
    port: 3001,
    routes: "routes",
    logger: true
});

server.start();