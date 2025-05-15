import { db } from "~/server/database/db"

export default defineEventHandler(async () => {
  try {
    const category = await db.query.category.findMany();
    
    return {
      statusCode: 200,
      data: category,
      message: 'Категории получены'
    }
  } catch {
    return {
      statusCode: 500,
      message: 'Не удалось получить категории',
      data: null
    }
  }
})