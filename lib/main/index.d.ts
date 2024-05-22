import { SendJSON, Success, Failure, ServerFailure, Redirect, Html, SendFile } from "../helpers/helper.ts";
import { query } from "../helpers/query.ts";
import { param } from "../helpers/param.ts";
import MongoService from "../instances/mongodb.ts";
import PgService from "../instances/postgres.ts";
import { json } from "../helpers/json.ts";
declare class ProBun {
    private port;
    private routes;
    private logger;
    private mongoUri;
    private pgConfig;
    constructor(props: {
        port: number;
        routes: string;
        logger: boolean;
        mongoUri?: any;
        pgConfig?: any;
    });
    start(): Promise<void>;
    definePreMiddleware(middleware: any): void;
    definePostMiddleware(middleware: any): void;
}
export { ProBun, SendJSON, Success, Failure, ServerFailure, Redirect, Html, query, param, MongoService, PgService, SendFile, json };
