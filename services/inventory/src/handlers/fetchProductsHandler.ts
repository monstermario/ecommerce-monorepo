import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import db from '../db';
import { productsTable } from '../db/schema';

const fetchProductsHandler = async (req: Request, res: Response) => {
    try {
        const product = await db.select().from(productsTable)

        res.json(product);
    } catch (error: unknown) {
        res.status(500).json({
            error: 'error fetching product: ' + error
        })
    }
};

export default fetchProductsHandler;