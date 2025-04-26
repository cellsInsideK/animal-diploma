import { defineEventHandler, getRouterParam, readBody } from "#imports";
import { eq } from "drizzle-orm";
import { supabase } from "~/lib/supabase";
import { db } from "~/server/database/db";
import { adoptions } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const {createdAt, image, ...body} = await readBody(event);

  try {
    const [item] = await db.select().from(adoptions).where(eq(adoptions.id, id));

    if (item.image !== image) {
      await supabase.storage.from('images').remove([item.image]);
    }

    const res =  await db.update(adoptions).set({...body, image, updatedAt: new Date()}).where(eq(adoptions.id, id));

    return ({statusCode: 200, message: 'Питомец обновлен',});
  } catch (error) {
    console.log(error);
    return ({statusCode: 500, message: 'Не удалось обновить питомца'})
  }
})