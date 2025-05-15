import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { groomingReviews } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const {userId, description, rating} = await readBody<{userId: string, description: string, rating: number}>(event);

  const exists = await db.select().from(groomingReviews).where(
    eq(groomingReviews.userId, userId)
  ).limit(1);

  if (exists.length !== 0) {
    return {
      statusCode: 500,
      message: 'Вы уже оставили отзыв на этот товар'
    }
  }

  await db.insert(groomingReviews).values({userId, description, rating})

  return {
    statusCode: 200,
    message: 'Отзыв создан'
  }
})