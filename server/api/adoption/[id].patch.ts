import { defineEventHandler, getRouterParam, readBody } from "#imports";
import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { adoptions, users } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const {createdAt, ...body} = await readBody(event);

  try {
    const res =  await db.update(adoptions).set({...body, updatedAt: new Date()}).where(eq(adoptions.id, id));

    return ({statusCode: 200, message: 'Питомец обновлен',});
  } catch (error) {
    console.log(error);
    return ({statusCode: 500, message: 'Не удалось обновить питомца'})
  }
})