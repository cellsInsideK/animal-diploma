import { and, eq, gt } from "drizzle-orm";
import { db } from "../database/db";
import { favorites, sessions, users } from "../database/schema";

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session_id');

  if (!sessionId) {
    return
  }

  const [session] = await db.select().from(sessions).where(and(
    eq(sessions.id, sessionId),
    gt(sessions.expiresAt, new Date())
  )).leftJoin(users, eq(sessions.userId, users.id));

  if (!session) {
    deleteCookie(event, 'session_id');
    return
  }

  const favorite = await db.select({productId: favorites.productId}).from(favorites).where(eq(favorites.userId, session.users?.id!));
  const mapped = favorite.map(item => item.productId)

  return {user: session.users!, favorites: mapped};
})