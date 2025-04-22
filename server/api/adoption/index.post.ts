import { db } from "~/server/database/db";
import { adoptions, SelectAdoption } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody<SelectAdoption>(event); 

  try {
    const newAnimal = await db.insert(adoptions).values(body);

    return {
      statusCode: 200,
      message: "Питомец успешно добавлен",
    };
  } catch {
    return {
      statusCode: 500,
      message: 'Не удалось создать питомца'
    }
  }
})