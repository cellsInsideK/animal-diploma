import { db } from "~/server/database/db"

export default defineEventHandler(async () => {
  try {
    const product = await db.query.products.findMany();
    
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