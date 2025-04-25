import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { adoptions } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;

  try {
    const [animal] = await db.select().from(adoptions).where(eq(adoptions.id, id));

    return {
      statusCode: 200,
      data: animal
    }
  } catch {
    return {
      statusCode: 404,
      message: 'Не найдено'
    }
  }
})