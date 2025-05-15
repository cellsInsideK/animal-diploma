import { db } from "~/server/database/db"
import { grooming } from "~/server/database/schema"

export default defineEventHandler(async () => {
  try {
    const res = await db.select().from(grooming);

    return {statusCode: 200, data: res}
  } catch {
    return {statusCode: 500, message: 'Не удалось получить данные'}
  }
})