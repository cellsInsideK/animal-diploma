import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { category } from "~/server/database/schema";
import { defineEventHandler, getRouterParam } from "#imports";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;

  try {

    await db.delete(category).where(eq(category.id, id));

    return {
      statusCode: 200,
      message: 'Категория удалена'
    }
  }
  catch {
    return {
      statusCode: 500,
      message: 'Не удалось удалить категорию'
    }
  }
});
