import { SendJSON, Success, Failure, ServerFailure, Redirect, Html } from "./helpers/helper.ts";
import { query } from "./helpers/query.ts";
import { param } from "./helpers/param.ts";
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
export { ProBun, SendJSON, Success, Failure, ServerFailure, Redirect, Html, query, param };
