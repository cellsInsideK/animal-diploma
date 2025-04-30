import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { orders } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = +getRouterParam(event, 'id')!;

  try {
    await db.delete(orders).where(eq(orders.id, id));

    return {
      statusCode: 200,
      message: 'Заказ удален'
    }
  } catch {
    return {
      statusCode: 500,
      message: 'Не удалось удалить заказ'
    }
  }
})