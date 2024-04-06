import { SendJSON, Success, Failure, ServerFailure, Redirect, Html } from "./helper";
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
export { ProBun, SendJSON, Success, Failure, ServerFailure, Redirect, Html };
