import { and, eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { reviews } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const reviewId = getRouterParam(event, 'id')!;

  try {
    await db.delete(reviews).where(eq(reviews.id, reviewId))

    return {
      statusCode: 200,
      message: 'Отзыв удален'
    }
  } catch {
    return {
      statusCode: 500,
      message: 'Не удалось удалить отзыв'
    }
  }
})