import { MongoClient } from 'mongodb';
import chalk from "chalk";

class Mongo {
    private client: MongoClient | null = null;
    private isConnected: boolean = false;
    private tryCount: number = 0;

    async connect(url: string): Promise<void> {
        this.client = new MongoClient(url);
        const start = Date.now();
        console.log(chalk.bold.whiteBright(`Connecting to MongoDB...`));
        try {
            this.tryCount++;
            await this.client.connect().then(() => {
                this.tryCount = 0;
                console.log(chalk.bold.whiteBright(`MongoDB connected in `) + chalk.bold.greenBright(`${Date.now() - start}ms`));
                this.isConnected = true;
            });

            this.client.on('close', async () => {
                this.isConnected = false;
                await this.connect(url);
            });
        } catch (e) {
            console.log(chalk.bold.whiteBright(`MongoDB connection failed in `) + chalk.bold.redBright(`${Date.now() - start}ms`));
            if (this.tryCount < 5) {
                await this.connect(url);
            } else {
                throw new Error('Failed to connect to MongoDB. Are you sure the URL is correct? 🥲');
            }
        }
    }

    async getCollection(db: string, col: string): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        return this.client!.db(db).collection(col);
    }

    async getDatabase(db: string): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        return this.client!.db(db);
    }

    async update(db: string, col: string, query: any, update: any): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        const collection = await this.getCollection(db, col);
        return collection.updateOne(query, update);
    }

    async insert(db: string, col: string, data: any): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        const collection = await this.getCollection(db, col);
        return collection.insertOne(data);
    }

    async find(db: string, col: string, query: any, options: any): Promise<any[]> {
        let opts = {};
        if (options) {
            opts = options;
        }
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        const collection = await this.getCollection(db, col);
        return collection.find(query, options).toArray();
    }

    async findOne(db: string, col: string, query: any): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        const collection = await this.getCollection(db, col);
        return collection.findOne(query);
    }

    async delete(db: string, col: string, query: any): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        const collection = await this.getCollection(db, col);
        return collection.deleteOne(query);
    }

    async deleteMany(db: string, col: string, query: any): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        const collection = await this.getCollection(db, col);
        return collection.deleteMany(query);
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
