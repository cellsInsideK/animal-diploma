import { defineEventHandler, getRouterParam, readBody } from "#imports";
import { eq, sql } from "drizzle-orm";
import { db } from "~/server/database/db";
import { orderItems, orders, products, SelectOrders } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = +getRouterParam(event, 'id')!;
  const body = await readBody(event);

  try {

    if (body.isVisible === false) {
      await db.update(orders).set({isVisible: false}).where(eq(orders.id, id));

      return ({statusCode: 200})
    }

    const [currentOrder] = await db.select().from(orders).where(eq(orders.id, id));

    if (currentOrder.status !== 'canceled' && body.status === 'canceled') {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

      items.forEach(async (item) => {
        await db.update(products).set({quantity: sql`${products.quantity} + ${item.quantity}`}).where(eq(products.id, item.productId!));
      })
    }

    const res =  await db.update(orders).set({...body, updatedAt: new Date()}).where(eq(orders.id, id));

    return ({statusCode: 200, data: res});
  } catch (error) {
    return ({statusCode: 500, message: 'Кажется, что-то пошло не так, попробуйте позже'})
  }
})