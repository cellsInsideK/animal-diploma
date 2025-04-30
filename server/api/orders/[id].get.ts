import { avg, count, eq, sql } from "drizzle-orm";
import { db } from "~/server/database/db";
import { orderItems, orders, productImages, products, reviews } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;

  try {
    const res = await db
      .select({
        order: orders,
        items: sql`jsonb_agg(
          jsonb_build_object(
            'order_item', ${orderItems},
            'product', jsonb_build_object(
              'details', ${products},
              'images', coalesce(
                (select jsonb_agg(${productImages}) 
                from ${productImages} 
                where ${productImages.productId} = ${products.id}),
                '[]'::jsonb
              )
            )
          )
        )`
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .where(eq(orders.userId, id))  // specify your order ID
      .groupBy(orders.id);

    return {
      statusCode: 200,
      data: res
    }
  } catch {
    return {
      statusCode: 200,
      message: 'Не удалось получить заказы'
    }
  }
})