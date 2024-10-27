import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { exec } from 'child_process';
import util from 'util';
import 'dotenv/config';
import { productsTable } from './schema'

const execAsync = util.promisify(exec);

const DATABASE_NAME =  process.env.DATABASE_NAME as string
const CONNECTION_STRING =   process.env.DATABASE_URL as string

const pool = new Pool({
    connectionString: CONNECTION_STRING,
});

const db = drizzle(pool);

export interface PgError extends Error {
    code?: string;
    message: string;
}

async function createDatabase(dbName: string) {
    console.log("creating database...")
    try {
        const result = await pool.query(`
            SELECT 1 FROM pg_database WHERE datname = $1
        `, [dbName]);

        if (result && result.rowCount as number > 0) {
            console.log(`Database "${dbName}" already exists.`);
            return;
        }


        await pool.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database "${dbName}" created successfully.`);
    } catch (error) {
        const perror = error as PgError
        if (perror.code === '42P04') {
            console.log(`Database "${dbName}" already exists.`);
        } else {
            throw new Error(`Error creating database: ${perror.message}`);
        }
    }
}

async function runMigrations() {
    console.log("running migrations...")
    try {
        await execAsync('npx drizzle-kit push');
        console.log('Migrations applied successfully.');
    } catch (error) {
        const perror = error as PgError
        throw new Error(`Error applying migrations: ${perror.message}`);
    }
}

async function isTableEmpty(): Promise<boolean> {
    const result = await db.select().from(productsTable).execute()
    return result.length == 0;
}

async function emptyTable() {
    await db.delete(productsTable).execute();
}

async function seedDatabase() {
    const products = [
        { name: "product_1", inventory_count: 10 },
        { name: "product_2", inventory_count: 20 },
        { name: "product_3", inventory_count: 30 },
        { name: "product_4", inventory_count: 40 },
        { name: "product_5", inventory_count: 50 },
    ]
    
    const newPool = new Pool({
        connectionString: CONNECTION_STRING,
    });

    const newDb = drizzle(newPool);

    try {
        await emptyTable()
        // Check if the 'products' table is empty
        
        for (const product of products) {
            await newDb.insert(productsTable).values(product).execute()
            console.log(`Inserted: ${product.name}`);
        }
    } catch (error) {
        const perror = error as PgError
        throw new Error(`Error seeding database: ${perror.message}`);
    } finally {
        await newPool.end();
    }
}

async function main() {
    await createDatabase(DATABASE_NAME);
    await runMigrations();
    await seedDatabase();
    await pool.end(); // Close the original connection
}

main()
    .then(() => {
        console.log('Database setup completed successfully.');
    })
    .catch((error) => {
        console.error('Setup failed:', error);
    });
