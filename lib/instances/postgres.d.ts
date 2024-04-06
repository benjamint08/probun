declare class Pg {
    private pool;
    connect(config: object): Promise<void>;
    endConnection(): Promise<void>;
    query(text: string, params?: any[]): Promise<any>;
}
declare class PgService {
    private static instance;
    constructor();
    static getInstance(): Pg;
}
export default PgService;
