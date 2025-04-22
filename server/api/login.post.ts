import { defineEventHandler, readBody, setCookie } from '#imports'
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt'
import { db } from '../database/db';
import { sessions, users } from '../database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    const existingUser = await db.query.users.findFirst({where: eq(users.email, body.email)});

    if (!existingUser) {
      return ({
        statusCode: 404,
        message: 'Пользователя с такими данными не существует',
      })
    }

    const validPassword = await bcrypt.compare(body.password, existingUser.passwordHash)

    if (!validPassword) {
      return ({
        statusCode: 401,
        message: 'Неверные данные'
      })
    }

    const [session] = await db.insert(sessions).values({
      userId: existingUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    }).returning();

    setCookie(event, 'session_id', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return ({
      statusCode: 200,
      message: 'Вы вошли в свой аккаунт',
      user: existingUser
    })
  }
  catch {
    return ({statusCode: 500, message: 'Кажется, что-то пошло не так, попробуйте позже'})
  }
})