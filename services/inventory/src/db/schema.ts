import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export interface Product {
  id: number
  name: string 
  inventory_count: number
}

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  inventory_count: integer().notNull(),
});