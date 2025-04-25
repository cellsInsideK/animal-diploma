import { db } from "~/server/database/db";
import { productImages, products, SelectProducts } from "~/server/database/schema";

type Body = { images: string[]} & SelectProducts

export default defineEventHandler(async (event) => {
  const {images, ...rest} = await readBody<Body>(event);

  console.log(images)
  console.log(rest);
  // return;


  try {
    const [product] = await db.insert(products).values(rest).returning();

    for (let i = 0; i < images.length; i++) {
      const img = await db.insert(productImages).values({productId: product.id, image: images[i]});
    }

    return {
      statusCode: 200,
      message: 'Товар создан'
    }
  } catch {
    return {
      statusCode: 500,
      message: 'Не удалось создать товар'
    }
  }
})