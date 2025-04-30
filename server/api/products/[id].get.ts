import { and, avg, count, eq, ne } from "drizzle-orm";
import { db } from "~/server/database/db";
import { productImages, products, reviews, users } from "~/server/database/schema";


export default defineEventHandler(async (event) => {
  const id = +getRouterParam(event, 'id')!

  try {
    const [product] = await db.select().from(products).where(eq(products.id, id));

    const otherTables = await Promise.all([
      await db.select().from(productImages).where(eq(productImages.productId, id)),
      await db.select({reviews, username: users.login}).from(reviews).where(eq(reviews.productId, id)).innerJoin(users, eq(reviews.userId, users.id)),
    ])

    const simillar = await db.select().from(products).where(and(
      eq(products.type, product.type),
      ne(products.id, product.id)
    ));
    const simillarProducts = await Promise.all(simillar.map(async (product) => {
        const [images, review] = await Promise.all([
          db.select()
            .from(productImages)
            .where(eq(productImages.productId, product.id)),
          
          db.select({count: count(), average: avg(reviews.rating)})
            .from(reviews)
            .where(eq(reviews.productId, product.id))
        ]);
        
        return {
          ...product,
          productImages: images,
          reviews: review[0]
        };
      }));

    return {
      statusCode: 200,
      data: {
        ...product, 
        productImages: otherTables[0],
        reviews: otherTables[1],
        simillar: simillarProducts,
      }
    };
  } catch (error) {
    console.log(`[ERROR]: ${error}`)
    return {
      statusCode: 500,
      message: 'Не удалось получить товары'
    };
  }
})