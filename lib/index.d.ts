declare class ProBun {
    private port;
    private routes;
    private logger;
    constructor(props: {
        port: number;
        routes: string;
        logger: boolean;
    });
    start(): void;
}
export default ProBun;
