import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { sessions, users } from "../database/schema";
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const [existingUser] = await db.select().from(users).where(eq(users.email, body.email));

    if (existingUser) {
      return createError({
        statusCode: 409,
        message: 'ПОльзователь с такими данными уже существует'
      })
    }

    const hash = await bcrypt.hash(body.password, 10);

    const [user] = await db.insert(users).values({
      email: body.email,
      login: body.login,
      passwordHash: hash
    }).returning();

    const [session] = await db.insert(sessions).values({
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }).returning();

    setCookie(event, 'session_id', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    return {
      statusCode: 200,
      message: 'Пользователь зарегестрирован',
      data: user
    }
  } catch {
    return createError({
      statusCode: 500,
      message: 'Не удалось создать пользователя'
    })
  }
})