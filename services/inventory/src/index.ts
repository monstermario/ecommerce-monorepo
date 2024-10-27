import express, { Request, Response } from 'express';
import fetchProductHandler from './handlers/fetchProductHandler';
import updateProductHandler from './handlers/updateProductHandler';
import fetchProductsHandler from './handlers/fetchProductsHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/products", fetchProductsHandler)
app.get("/api/product", fetchProductHandler);
app.post("/api/product", updateProductHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
