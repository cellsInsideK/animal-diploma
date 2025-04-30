import { avg, count, eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { favorites, productImages, products, reviews, SelectFavorites } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;

  try {
    const fav = await db.select().from(favorites).where(eq(favorites.userId, id));
    
    const test = await getDetails(fav);

    return {
      statusCode: 200,
      data: test
    }
  } catch {
    return {
      statusCode: 500,
      message: 'Не удалось получить избранные товары'
    }
  }
})

const getDetails = async (array: SelectFavorites[]) => {
  const product = await Promise.all( array.map(async (item) => {
    const [product] = await db.select().from(products).where(eq(products.id, item.productId));
    return product
  }));

  const res = await Promise.all(product.map(async (product) => {
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

  return res;
}