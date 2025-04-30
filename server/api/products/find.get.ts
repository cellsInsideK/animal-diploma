import { asc, avg, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "~/server/database/db"
import { productImages, products, reviews, users } from "~/server/database/schema"
import { productTypeEnum } from "~/utils/productType";

type Query = {
  sort: 'new' | 'old' | 'cheap' | 'expensive',
  type: '' | keyof typeof productTypeEnum,
  name: string,
  limit: number
}

export default defineEventHandler(async (event) => {
  let {sort = 'new', type = '', name = '', limit = 0} = getQuery<Query>(event);
  name = name === '' ? '' : `%${name}%`

  let queryBuilder = db
    .select()
    .from(products)
    .$dynamic();

  try {
    if (type !== '') {
      queryBuilder = queryBuilder.where(eq(products.type, type))
    }

    if (name.trim() !== '') {
      queryBuilder = queryBuilder.where(ilike(products.name, name))
    }

    if (limit !== 0) {
      queryBuilder = queryBuilder.limit(+limit);
    }

    switch (sort) {
      case 'new':
        queryBuilder = queryBuilder.orderBy(desc(products.createdAt))
        break;
      case 'old':
        queryBuilder = queryBuilder.orderBy(asc(products.createdAt))
        break;
      case 'cheap':
        queryBuilder = queryBuilder.orderBy(asc(products.price))
        break
        case 'expensive':
        queryBuilder = queryBuilder.orderBy(desc(products.price))
        break;
    }

    const data = await queryBuilder.execute();

    const enhancedProducts = await Promise.all(data.map(async (product) => {
      const [images, review] = await Promise.all([
        db.select()
          .from(productImages)
          .where(eq(productImages.productId, product.id)),
        
        db.select({count: count(), average: avg(reviews.rating)})
          .from(reviews)
          .where(eq(reviews.productId, product.id))
      ]);
      
      return {
        ...product,
        productImages: images,
        reviews: review[0]
      };
    }));

    return {
      statusCode: 200,
      data: enhancedProducts
    };
  } catch (error) {
    console.log(`[ERROR]: ${error}`)
    return {
      statusCode: 500,
      message: 'Не удалось получить товары'
    };
  }
})