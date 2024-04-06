import { Pool } from 'pg';
import chalk from "chalk";

class Pg {
    private pool: Pool | null = null;
    private isConnected: boolean = false;

    async connect(config: object): Promise<void> {
        this.pool = new Pool({
            ssl: {
                rejectUnauthorized: false
            },
            ...config
        });
        const start = Date.now();
        try {
            await this.pool.connect();
            console.log(chalk.bold.whiteBright(`PostgreSQL connected in `) + chalk.bold.greenBright(`${Date.now() - start}ms`));
            this.isConnected = true;
        } catch (error) {
            console.log("Error while trying to establish postgres connection", error)
        }
    }

    async endConnection(){
        await this.pool?.end();
    }

    async query(text: string, params?: any[]) :Promise<any>{
        if (!this.isConnected) {
            throw new Error('Not connected to PostgreSQL');
        }
        return this.pool?.query(text,params) ;
    }
}

class PgService {
    private static instance: Pg | null = null;

    constructor() {
        throw new Error('Use PgService.getInstance()');
    }

    static getInstance(): Pg {
        if (!PgService.instance) {
            PgService.instance = new Pg();
        }
        return PgService.instance;
    }
}

export default PgService;