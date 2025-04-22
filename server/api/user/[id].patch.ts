import { defineEventHandler, getRouterParam, readBody } from "#imports";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt'
import { db } from "~/server/database/db";
import { users } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const {dirtyPassword, passwordHash, createdAt, ...body} = await readBody(event);
  let newPass = passwordHash;

  if (dirtyPassword) {
    newPass = await bcrypt.hash(passwordHash, 10);
  }

  try {
    const res =  await db.update(users).set({...body, passwordHash: newPass, updatedAt: new Date()}).where(eq(users.id, id));

    return ({statusCode: 200, message: 'Пользователь обновлен',});
  } catch (error) {
    console.log(error);
    return ({statusCode: 500, message: 'Не удалось обновить пользователя'})
  }
})