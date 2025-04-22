import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { sessions } from "../database/schema";

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'session_id');

  if (!session) {
    deleteCookie(event, 'session_id');

    return createError({
      statusCode: 400,
    })
  }

  await db.delete(sessions).where(eq(sessions.id, session))
  deleteCookie(event, 'session_id');

  return {
    statusCode: 200
  }
})