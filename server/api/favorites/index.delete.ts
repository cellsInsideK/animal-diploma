import { and, eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { favorites } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const {productId, userId} = await readBody<{userId: string, productId: number}>(event);

  try {
    await db.delete(favorites).where(and(
      eq(favorites.productId, productId),
      eq(favorites.userId, userId)
    ));

    return {
      statusCode: 200,
      message: 'Товар удален из избранного'
    }
  } catch {
    return {statusCode: 500, message: 'Не удалость удалить товар из избранного'}
  }
})