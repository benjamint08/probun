declare class Mongo {
    private client;
    private isConnected;
    connect(url: string): Promise<void>;
    getCollection(db: string, col: string): Promise<any>;
    getDatabase(db: string): Promise<any>;
    update(db: string, col: string, query: any, update: any): Promise<any>;
    insert(db: string, col: string, data: any): Promise<any>;
    find(db: string, col: string, query: any, options: any): Promise<any[]>;
    findOne(db: string, col: string, query: any): Promise<any>;
    delete(db: string, col: string, query: any): Promise<any>;
    deleteMany(db: string, col: string, query: any): Promise<any>;
    close(): Promise<void>;
}
declare class MongoService {
    private static instance;
    constructor();
    static getInstance(): Mongo;
}
export default MongoService;
