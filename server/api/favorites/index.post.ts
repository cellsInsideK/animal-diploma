import { db } from "~/server/database/db";
import { favorites } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const {productId, userId} = await readBody<{userId: string, productId: number}>(event);

  try {
    await db.insert(favorites).values({productId, userId});

    return {
      statusCode: 200,
      message: 'Товар добавлен в избранное'
    }
  } catch {
    return {statusCode: 500, message: 'Не удалость добавить товар в избранное'}
  }
})