import { defineEventHandler, getRouterParam, readBody } from "#imports";
import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { category } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const {name} = await readBody(event);

  try {
    const res =  await db.update(category).set({name, updatedAt: new Date()}).where(eq(category.id, id));

    return ({statusCode: 200, message: 'Категория обновлена'});
  } catch (error) {
    console.log(error);
    return ({statusCode: 500, message: 'Не удалось обновить категорию'})
  }
})