import { eq } from "drizzle-orm"
import { db } from "~/server/database/db"
import { adoptionRequests, adoptions } from "~/server/database/schema"

export default defineEventHandler(async (event) => {
  try {
    const req = await db.select().from(adoptionRequests).leftJoin(adoptions, eq(adoptionRequests.animalId, adoptions.id))

    return {
      statusCode: 200,
      data: req
    }
  } catch {
    return {
      statusCode: 500
    }
  }
})