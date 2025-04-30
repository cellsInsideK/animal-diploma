import { sql, eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { orderItems, orders, products } from "~/server/database/schema";

interface Items {
  id: number,
  amount: number,
}

interface Body {
  address: string,
  tel: string,
  userId: string,
  items: Items[],
  name: string,
  id: number
}

export default defineEventHandler(async (event) => {
  const {address, tel, userId, items, name, ...rest} = await readBody<Body>(event);

  try {
    const [order] = await db.insert(orders).values({address, tel, userId, name, ...rest}).returning();

    items.forEach(async (item) => {
      await db.update(products).set({quantity: sql`${products.quantity} - ${item.amount}` }).where(eq(products.id, item.id))
    })

    const body = items.map(item => ({orderId: order.id, productId: item.id, quantity: item.amount}))
    const cartItems = await db.insert(orderItems).values(body);

    return {
      statusCode: 200,
      message: 'Заказ создан!'
    }
  } catch (e) {
    console.log('[ERROR]: ', e);
    return {
      statusCode: 500,
      message: 'Не удалось создать заказ'
    }
  }
  
})