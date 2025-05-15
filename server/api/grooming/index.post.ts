import { db } from "~/server/database/db"
import { grooming } from "~/server/database/schema"

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const res = await db.insert(grooming).values({
      name: body.name, 
      tel: body.tel, 
      animalType: body.animalType,
      breed: body.breed,
      age: body.age,
      comment: body.comment,
      items: body.items
    })

    return {statusCode: 200, message: 'Заявка создана'}
  } catch {
    return {statusCode: 500, message: 'Не удалось создать заявку'}
  }
})