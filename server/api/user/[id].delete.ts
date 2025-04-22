import { eq } from "drizzle-orm";
import { db } from "~/server/database/db";
import { users } from "~/server/database/schema";
import { defineEventHandler, getRouterParam } from "#imports";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;

  try {
    await db.delete(users).where(eq(users.id, id));

    return {
      statusCode: 200,
      message: 'Пользователь удален'
    }
  }
  catch {
    return {
      statusCode: 500,
      message: 'Не удалось удалить пользователя'
    }
  }
});
