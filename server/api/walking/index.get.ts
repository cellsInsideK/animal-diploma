import { db } from "~/server/database/db"
import { walking } from "~/server/database/schema"

export default defineEventHandler(async () => {
  try {
    const res = await db.select().from(walking);

    return {
      statusCode: 200,
      data: res
    }
  } catch {
    return {statusCode: 500, message: 'Не удалось получить заявки'}
  }
})