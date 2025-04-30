<script setup lang="ts">
  import { toast } from 'vue-sonner';
  import { type SelectProductImages, type SelectProducts } from '~/server/database/schema';

  type Card = { reviews: { average: string | null, count: number }, productImages: SelectProductImages[] } & SelectProducts;

  const { item } = defineProps<{ item: Card }>()
  const userStore = useUserStore();
  const cartStore = useCartStore();

  const addToCart = () => {
    if (!userStore.isAuthenticated) {
      return toast.error('Ошибка', { description: 'Необходимо авторизоваться' });
    }

    cartStore.addProduct(item);
    return toast.success('Товар добавлен в корзину!');
  }

  const addToFavorite = async () => {
    if (!userStore.isAuthenticated) {
      return toast.error('Ошибка', { description: 'Необходимо авторизоваться' });
    }

    const idx = userStore.favoriteStorage.findIndex(i => i === item.id)

    if (idx !== -1) {
      const res = await $fetch('/api/favorites', { method: 'DELETE', body: { userId: userStore.user?.id, productId: item.id } });
      if (res.statusCode !== 200) {
        return toast.error('Ошибка', { description: res.message });
      }

      return userStore.favoriteStorage.splice(idx, 1);
    }

    const res = await $fetch('/api/favorites', { method: 'POST', body: { userId: userStore.user?.id, productId: item.id } });
    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    return userStore.favoriteStorage.push(item.id);
  }

  const calculateRating = () => {
    if (item.reviews.average == null) {
      return 0
    }

    return Math.floor(Number(item.reviews.average))
  }

  const getRatingCount = () => {
    if (item.reviews.count === 0) {
      return '(нет отзывов)'
    }

    const ruRules = new Intl.PluralRules('ru');
    const suffixes = new Map([
      ['one', 'ыв'],
      ['few', 'ыва'],
      ['many', 'ов'],
    ]);

    const rule = ruRules.select(item.reviews.count);
    const suffix = suffixes.get(rule);

    return `(${item.reviews.count} отз${suffix})`;
  }

  //TODO add to favorites
</script>

<template>
  <NuxtLink :to="`/products/${item.id}`"
    class="flex flex-col p-4 border-3 border-ui-primary rounded-md max-w-[250px] gap-4 relative">
    <div class="flex flex-col gap-4">
      <img :src="getImageUrl(item.productImages.at(-1)!.image)" alt="image"
        class="w-[200px] h-[200px] object-contain  self-center">
      <p class="text-ui-primary font-bold text-3xl">{{ item.price }} ₽</p>
      <h2 class="font-medium text-base line-clamp-4">{{ item.name }}</h2>
    </div>
    <div class="flex flex-col gap-4 mt-auto w-full">
      <div class="flex justify-between items-center">
        <div class="flex flex-row gap-1">
          <img v-for="i in calculateRating()" src="/star.svg" alt="">
        </div>
        <p class="font-medium text-xs opacity-35 justify-self-end-safe">
          {{ getRatingCount() }}
        </p>
      </div>
      <Button @click.prevent="addToCart" class="bg-ui-primary w-full cursor-pointer">Купить</Button>
    </div>
    <UIHeart @click.prevent="addToFavorite" :product-id="item.id" class="absolute right-5 top-5" />
  </NuxtLink>
</template>