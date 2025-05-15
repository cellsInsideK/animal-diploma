import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { walking } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const body = await readBody(event);

  try {
    if (body.date && body.time) {
      await db.update(walking).set({date: body.date, time: body.time, updatedAt: new Date()}).where(eq(walking.id, id))
    } else {
      await db.update(walking).set({status: body.status, updatedAt: new Date()}).where(eq(walking.id, id))
    }

    return {statusCode: 200, message: 'Заявка обновлена'}
  } catch {
    return {statusCode: 500, message: 'Не удалось обновить заявку'}
  }
})