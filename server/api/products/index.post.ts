import { db } from "~/server/database/db";
import { productImages, products } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const {images, ...rest} = await readBody(event);
  console.log(images)
  console.log(rest)

  try {
    const [product] = await db.insert(products).values(rest).returning();

    for (let i = 0; i < images.length; i++) {
      const img = await db.insert(productImages).values({productId: product.id, image: images[i]});
    }

    return {
      statusCode: 200,
      message: 'Товар создан'
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      message: 'Не удалось создать товар'
    }
  }
})