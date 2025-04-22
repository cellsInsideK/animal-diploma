import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { adoptions } from "~/server/database/schema";
import { defineEventHandler, getRouterParam } from "#imports";
import { supabase } from "~/lib/supabase";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;

  try {
    const [item] = await db.select().from(adoptions).where(eq(adoptions.id, id));

    await supabase.storage.from('images').remove([item.image])
    await db.delete(adoptions).where(eq(adoptions.id, id));

    return {
      statusCode: 200,
      message: 'Питомец удален'
    }
  }
  catch {
    return {
      statusCode: 500,
      message: 'Не удалось удалить питомца'
    }
  }
});
