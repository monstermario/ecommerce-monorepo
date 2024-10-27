import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import db from '../db';
import { Product, productsTable } from '../db/schema';
import { PgError } from '../db/setup';


const fetchProduct = async (productName: string) => {
    const where = eq(productsTable.name, productName)
    const product = await db.select().from(productsTable).where(where).limit(1).execute()

    if (product.length == 1) {
        return product[0] as Product
    }

    return false
}


const updateProductHandler = async (req: Request, res: Response) => {
    const { productName, numberBought } = req.body //{ productName: "product_3", numberBought: "3" }
    
    if (!productName) {
        res.status(400).json({ error: 'productName is required' });
        return
    }

    if (typeof numberBought !== 'number') {
        res.status(400).json({ error: 'numberBought is required' });
        return
    }

    try {
        // first fetch the product 
        const product = await fetchProduct(productName)
        if (!product) {
            res.status(400).json({ error: `product: ${productName} does not exist` });
            return
        }

        // ensure that numberBought is less than or equal to the inventory_count
        if (numberBought > product.inventory_count) {
            res.status(400).json({ error: `numberBought exceeds product inventory count` });
            return
        }
        
        // all is well. perform the update 
        await db
        .update(productsTable)
        .set({
          inventory_count: product.inventory_count - numberBought,
        })
        .where(eq(productsTable.name, productName));
        
        res.status(200).json({ success: true })

    } catch (error) {
        const perror = error as PgError
        res.status(400).json({
            error: `Error updating product: ${perror.message}`
        });
    }
};

export default updateProductHandler;