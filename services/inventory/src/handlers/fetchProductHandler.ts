import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import db from '../db';
import { productsTable } from '../db/schema';

const fetchProductHandler = async (req: Request, res: Response) => {
    const { productName } = req.query
    if (!productName || typeof productName != "string" || productName == "") {
        res.status(400).json({
            error: 'Query parameter "productName" is required and must be a string.'
        });
        return
    }
    
    
    try {
        const where = eq(productsTable.name, productName)
        const product = await db.select().from(productsTable).where(where)

        res.json(product);
    } catch (error: unknown) {
        res.status(500).json({
            error: 'error fetching product: ' + error
        })
    }
};

export default fetchProductHandler;