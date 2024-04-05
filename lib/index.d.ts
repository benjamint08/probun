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
    definePreMiddleware(middleware: any): void;
    definePostMiddleware(middleware: any): void;
}
export default ProBun;
