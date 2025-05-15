import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { grooming } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const body = await readBody(event);

  try {
    await db.update(grooming).set({status: body.status, updatedAt: new Date()}).where(eq(grooming.id, id))

    return {statusCode: 200, message: 'Заявка обновлена'}
  } catch {
    return {statusCode: 500, message: 'Не удалось обновить заявку'}
  }
})