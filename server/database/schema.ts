import { boolean, index, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

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
  animalId: uuid('animalId').references(() => adoptions.id, {onDelete: 'cascade'}),
  createdAt: timestamp('created_at').defaultNow(),
})

export type SelectAdoptionRequests = typeof adoptionRequests.$inferSelect;

export const productType = pgEnum('productType', ['cat', 'dog', 'toy', 'medicine', 'rat']);

export type SelectProductType = typeof productType.enumValues;

export const products = pgTable('products', {
  id: integer('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  price: integer('price').notNull(),
  quantity: integer('quantity').notNull(),
  description: varchar('description').notNull(),
  type: productType('type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type SelectProducts = typeof products.$inferSelect;

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').references(() => users.id, {onDelete: 'cascade'}).notNull(),
  productId: integer('productId').references(() => products.id, {onDelete: 'cascade'}).notNull(),
  rating: integer('rating').notNull(),
  description: varchar('description').notNull(),
})

export type SelectPreviews = typeof reviews.$inferSelect;

export const productImages = pgTable('productImages', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  productId: integer('productId').references(() => products.id, {onDelete: 'cascade'}).notNull(),
  image: varchar('image').notNull()
})

export type SelectImages = typeof productImages.$inferSelect;

export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').references(() => users.id, {onDelete: 'cascade'}).notNull(),
  productId: integer('productId').references(() => products.id, {onDelete: 'cascade'}).notNull(),
})

export type SelectFavorites = typeof favorites.$inferSelect;

export const orders = pgTable('orders', {
  id: integer('id').primaryKey().notNull(),
  userId: uuid('userId').references(() => users.id, {onDelete: 'cascade'}).notNull(),
  tel: varchar('tel', {length: 20}).notNull(),
  address: varchar('address', {length: 100}).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type SelectOrders = typeof orders.$inferSelect;

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: integer('order_id').references(() => orders.id, {onDelete: 'cascade'}),
  productId: integer('product_id').references(() => products.id, {onDelete: 'cascade'}),
  quantity: integer('quantity').notNull(),
});

export type SelectOrderItems = typeof orderItems.$inferSelect;