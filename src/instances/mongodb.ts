import { MongoClient } from 'mongodb';
import chalk from "chalk";

class Mongo {
    private client: MongoClient | null = null;

    async connect(url: string): Promise<void> {
        this.client = new MongoClient(url);
        await this.client.connect().then(() => {
            console.log(chalk.greenBright("Connected to MongoDB"));
        });
    }

    async getCollection(db: string, col: string): Promise<any> {
        return this.client!.db(db).collection(col);
    }

    async getDatabase(db: string): Promise<any> {
        return this.client!.db(db);
    }

    async update(db: string, col: string, query: any, update: any): Promise<any> {
        const collection = await this.getCollection(db, col);
        return collection.updateOne(query, update);
    }

    async insert(db: string, col: string, data: any): Promise<any> {
        const collection = await this.getCollection(db, col);
        return collection.insertOne(data);
    }

    async find(db: string, col: string, query: any): Promise<any[]> {
        const collection = await this.getCollection(db, col);
        return collection.find(query).toArray();
    }

    async findOne(db: string, col: string, query: any): Promise<any> {
        const collection = await this.getCollection(db, col);
        return collection.findOne(query);
    }

    async delete(db: string, col: string, query: any): Promise<any> {
        const collection = await this.getCollection(db, col);
        return collection.deleteOne(query);
    }

    async close(): Promise<void> {
        await this.client!.close();
    }
}

class MongoService {
    private static instance: Mongo | null = null;

    constructor() {
        throw new Error('Use MongoService.getInstance()');
    }

    static getInstance(): Mongo {
        if (!MongoService.instance) {
            MongoService.instance = new Mongo();
        }
        return MongoService.instance;
    }
}

export default MongoService;