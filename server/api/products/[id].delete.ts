import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { productImages, products } from "~/server/database/schema";
import { defineEventHandler, getRouterParam } from "#imports";
import { supabase } from "~/lib/supabase";

export default defineEventHandler(async (event) => {
  const id = +getRouterParam(event, 'id')!;

  try {
    const item = await db.select().from(productImages).where(eq(productImages.productId, id));
    const images: string[] = [];

    item.forEach((item) => {
      images.push(item.image);
    })

    await supabase.storage.from('images').remove(images)
    await db.delete(products).where(eq(products.id, id));

    return {
      statusCode: 200,
      message: 'Товар удален'
    }
  }
  catch {
    return {
      statusCode: 500,
      message: 'Не удалось удалить товар'
    }
  }
});
