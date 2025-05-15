import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { groomingReviews, users } from "~/server/database/schema";

export default defineEventHandler(async () => {
  try {
    const res = await db.select({groomingReviews, username: users.login}).from(groomingReviews).innerJoin(users, eq(groomingReviews.userId, users.id))

    return {
      statusCode: 200,
      data: res
    }
  } catch {
    return {statusCode: 500, message: 'Не удалось получить отзывы'}
  }
})