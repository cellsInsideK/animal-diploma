import { defineEventHandler } from "#imports";
import { db } from "~/server/database/db";

export default defineEventHandler(async () => {
  try {
    const adoptions = await db.query.adoptions.findMany();

    return {
      statusCode: 200,
      data: adoptions
    }
  }
  catch {
    return {
      statusCode: 500,
      message: 'Не удалось получить данные'
    }
  }
})
