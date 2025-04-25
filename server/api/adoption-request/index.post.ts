import { db } from "~/server/database/db";
import { adoptionRequests } from "~/server/database/schema";


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body.id)

  try {
    await db.insert(adoptionRequests).values(body);
    return {
      statusCode: 200,
    }
  } catch(e) {
    console.log(e)
    return {
      statusCode: 500
    }
  }
})