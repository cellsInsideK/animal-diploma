import { eq } from "drizzle-orm";
import { db } from "~/server/database/db"
import { category, products } from "~/server/database/schema";

export default defineEventHandler(async () => {
  try {
    const product = await db.select().from(products).leftJoin(category,eq(category.id, products.type)).orderBy(products.createdAt);
    
    return {
      statusCode: 200,
      data: product,
      message: 'Товары получены'
    }
  } catch {
    return {
      statusCode: 500,
      message: 'Не удалось получить товары',
      data: null
    }
  }
})