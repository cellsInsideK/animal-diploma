import { db } from "~/server/database/db";
import { walking } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    if (body.type === 'walk') {
      await db.insert(walking).values({
        name: body.name, 
        tel: body.tel, 
        type: body.type, 
        animalType: body.animalType,
        date: body.date,
        time: body.time,
        comment: body.comment,
      })

      return {statusCode: 200, message: 'Заявка создана'}
    } else if (body.type === 'keep') {
      await db.insert(walking).values({
        name: body.name, 
        tel: body.tel, 
        type: body.type, 
        animalType: body.animalType,
        comment: body.comment,
      })

      return {statusCode: 200, message: 'Заявка создана'}
    }

    return {statusCode: 200, message: 'Заявка создана'}
  } catch {
    return {statusCode: 500, message: 'Не удалось создать заявку'}
  }
})