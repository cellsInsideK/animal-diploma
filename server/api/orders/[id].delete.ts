import { eq, sql } from "drizzle-orm";
import { db } from "~/server/database/db";
import { orderItems, orders, products } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = +getRouterParam(event, 'id')!;

  try {
    const [currentOrder] = await db.select().from(orders).where(eq(orders.id, id));
    
    if (currentOrder.status !== 'canceled') {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

      items.forEach(async (item) => {
        await db.update(products).set({quantity: sql`${products.quantity} + ${item.quantity}`}).where(eq(products.id, item.productId!));
      })
    }

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