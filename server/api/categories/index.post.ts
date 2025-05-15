import { defineEventHandler, getRouterParam, readBody } from "#imports";
import { db } from "~/server/database/db";
import { category } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const {name} = await readBody(event);

  try {
    const res =  await db.insert(category).values({name: name});

    return ({statusCode: 200, message: 'Категория создана'});
  } catch (error) {
    console.log(error);
    return ({statusCode: 500, message: 'Не удалось создать категорию'})
  }
})