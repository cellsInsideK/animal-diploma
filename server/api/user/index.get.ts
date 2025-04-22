import { defineEventHandler } from "#imports";
import { db } from "~/server/database/db";

export default defineEventHandler(async () => {
  try {
    const users = await db.query.users.findMany();

    return {
      statusCode: 200,
      data: users
    }
  }
  catch {
    return {
      statusCode: 500,
      message: 'Не удалось получить данные'
    }
  }
})
