import { defineEventHandler, getRouterParam, readBody } from "#imports";
import { eq } from "drizzle-orm";
import { supabase } from "~/lib/supabase";
import { db } from "~/server/database/db";
import { productImages, products } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = +getRouterParam(event, 'id')!;
  const {createdAt, images, ...body} = await readBody(event);

  try {
    const imagesArray = await db.select().from(productImages).where(eq(productImages.productId, id))
    const imagesNames: string[] = [];
    
    if (images.length > 0) {
      imagesArray.forEach( item => {
        imagesNames.push(item.image);
      })

      await supabase.storage.from('images').remove(imagesNames);

      await db.delete(productImages).where(eq(productImages.productId, id));

      images.forEach(async (item: string) => {
        await db.insert(productImages).values({image: item, productId: id});
      })
    }

    const res =  await db.update(products).set({...body, updatedAt: new Date()}).where(eq(products.id, id));

    return {statusCode: 200, message: 'Товар обновлен'};
  } catch  {
    return {statusCode: 500, message: 'Не удалось обновить товар'}
  }
})