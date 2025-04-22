import { boolean, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  login: varchar('login', {length: 50}).notNull(),
  email: varchar('email', {length: 50}).unique().notNull(),
  passwordHash: varchar('passwordHash', {length: 255}).notNull(),
  isAdmin: boolean('isAdmin').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type SelectUsers = typeof users.$inferSelect;

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
}));

export type SelectSessions = typeof sessions.$inferSelect;

export const animalType = pgEnum('animalType', ['cat', 'dog'])

export const adoptions = pgTable('adoptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', {length: 50}).notNull(),
  type: animalType('type').notNull(),
  sex: varchar('sex', {length: 20}).notNull(),
  age: varchar('age', {length: 30}).notNull(),
  image: varchar('image').notNull(),
  description: varchar('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type SelectAdoption = typeof adoptions.$inferSelect;

export const adoptionRequests = pgTable('adoptionRequests', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', {length:50}).notNull(),
  tel: varchar('tel', {length: 20}).notNull(),
  animalId: uuid('animalId').references(() => adoptions.id, {onDelete: 'cascade'}) 
})

export type SelectAdoptionRequests = typeof adoptionRequests.$inferInsert;