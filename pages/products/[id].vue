<script setup lang="ts">
  import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
  import { useMediaQuery } from '@vueuse/core';
  import { toast } from 'vue-sonner';
  import ReviewModal from '~/components/modals/ReviewModal.vue';
  import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
  import type { SelectProductImages, SelectProducts, SelectReviews } from '~/server/database/schema';
  import Autoplay from 'embla-carousel-autoplay'

  type Sort = 'positive' | 'negative';
  type Item = {
    productImages: SelectProductImages[],
    reviews: { reviews: SelectReviews, username: string }[],
    simillar: Item[]
  } & SelectProducts

  const id = useRoute().params.id
  const item = ref<Item>({} as Item);
  const isLoading = ref(true);
  const selectedImage = ref('')
  const isMobile = useMediaQuery(' (max-width: 768px)');
  const sortType = ref<Sort>('positive');
  const userStore = useUserStore();
  const cartStore = useCartStore();
  const inFavorite = ref()

  const isModalVisible = ref(false);

  const sortedReviews = computed(() => {
    switch (sortType.value) {
      case 'positive':
        return item.value.reviews.sort((a, b) => {
          if (a.reviews.rating > b.reviews.rating) return -1;
          if (a.reviews.rating < b.reviews.rating) return 1;
          return 0
        })
      case 'negative':
        return item.value.reviews.sort((a, b) => {
          if (a.reviews.rating < b.reviews.rating) return -1;
          if (a.reviews.rating > b.reviews.rating) return 1;
          return 0
        })
    }
  })

  const getData = async () => {
    isLoading.value = true;
    const res = await $fetch(`/api/products/${id}`);
    isLoading.value = false;
    // @ts-ignore
    item.value = res.data;
    selectedImage.value = item.value.productImages.at(-1)?.image || ''
    inFavorite.value = userStore.favoriteStorage.findIndex(i => i === item.value.id)
  }

  const reviewModal = () => {
    if (!userStore.isAuthenticated) {
      return toast.error('Ошибка', { description: 'Необходимо авторизоваться' })
    }

    return isModalVisible.value = true;
  }

  const calculateRating = () => {
    if (item.value?.reviews?.length === 0) {
      return 0;
    }

    const rating = item.value?.reviews?.reduce((acc, item) => {
      return acc += item?.reviews?.rating
    }, 0);

    return Math.floor(rating / item.value?.reviews?.length)
  }

  const countRating = () => {
    if (item.value?.reviews?.length === 0) {
      return '(нет отзывов)'
    }

    const ruRules = new Intl.PluralRules('ru');
    const suffixes = new Map([
      ['one', 'ыв'],
      ['few', 'ыва'],
      ['many', 'ов'],
    ]);

    const rule = ruRules.select(item.value?.reviews?.length);
    const suffix = suffixes.get(rule);

    return `(${item.value?.reviews?.length} отз${suffix})`;
  }

  const copyText = () => {
    toast.success('Артикул скопирован')
    return navigator.clipboard.writeText(String(item.value.id))
  }

  const addToFavorite = async () => {
    if (!userStore.isAuthenticated) {
      return toast.error('Ошибка', { description: 'Необходимо авторизоваться' });
    }

    if (inFavorite.value !== -1) {
      const res = await $fetch('/api/favorites', { method: 'DELETE', body: { userId: userStore.user?.id, productId: item.value.id } });
      if (res.statusCode !== 200) {
        return toast.error('Ошибка', { description: res.message });
      }

      return userStore.favoriteStorage.splice(inFavorite.value, 1);
    }

    const res = await $fetch('/api/favorites', { method: 'POST', body: { userId: userStore.user?.id, productId: item.value.id } });
    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    return userStore.favoriteStorage.push(item.value.id);
  }

  const addToCart = () => {
    if (!userStore.isAuthenticated) {
      return toast.error('Ошибка', { description: 'Необходимо авторизоваться' });
    }

    cartStore.addProduct(item.value);
    return toast.success('Товар добавлен в корзину!');
  }

  watch(userStore.favoriteStorage, (newVal) => {
    inFavorite.value = newVal.findIndex(i => i === item.value.id)
  })

  onMounted(async () => {
    await getData();
    useHead({ title: item.value?.name || 'Товар не найден!' })
  })
</script>

<template>
  <UiLoader :is-loading="isLoading">
    <ReviewModal v-model:is-visible="isModalVisible" :product-id="item?.id" @created="getData" />
    <UISection v-if="item?.id">
      <h2 class="font-bold text-ui-primary text-lg md:text-2xl">{{ item.name }}</h2>
      <div class="flex flex-col md:flex-row gap-10 h-full my-5">
        <div class="flex flex-col-reverse w-full md:flex-row gap-4 items-center">
          <div class="items-center">
            <Carousel :orientation="isMobile ? 'horizontal' : 'vertical'" class="h-full w-full md:max-w-xs" :opts="{
              align: 'start',
            }">
              <CarouselContent class="h-full flex-row-reverse md:flex-col-reverse">
                <CarouselItem v-for="(item, index) in item.productImages" :key="index" class="shrink-1">
                  <img @click="selectedImage = item.image" :src="getImageUrl(item.image)"
                    class="h-[150px] w-[150px] cursor-pointer object-contain"
                    :class="selectedImage === item.image ? 'border-2 border-ui-primary rounded-sm' : ''" alt="">
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
          <img :src="getImageUrl(selectedImage)" class="max-h-[450px]" alt="">
        </div>
        <div class="flex flex-col gap-5 w-full md:mt-20">
          <div class="flex gap-2 items-center">
            <img src="/star.svg" v-for="i in calculateRating()" class="w-6 h-6" alt="">
            <p>{{ countRating() }}</p>
            <div class="gap-2 cursor-pointer items-center ml-4 hidden md:flex" @click="addToFavorite">
              <p class="font-medium text-lg">{{ inFavorite !== -1 ? 'Удалить из избранного:' : 'В избранное:' }}</p>
              <UIHeart :product-id="item.id" />
            </div>
          </div>
          <div class="flex gap-2 cursor-pointer items-center md:hidden" @click="addToFavorite">
            <p class="font-medium text-lg">{{ inFavorite !== -1 ? 'Удалить из избранного:' : 'В избранное:' }}</p>
            <UIHeart :product-id="item.id" />
          </div>
          <div @click="copyText" class="flex gap-2 items-center cursor-pointer">
            <p class="font-medium text-lg opacity-50">Артикул: {{ item.id }}</p>
            <img src="/copy.svg" alt="">
          </div>
          <div class="flex flex-row md:flex-col gap-5 w-full">
            <p class="font-bold text-ui-primary text-2xl">{{ item.price }}&nbsp;₽</p>
            <Button @click="addToCart" class="bg-ui-primary w-fit md:w-full cursor-pointer">Добавить в корзину</Button>
          </div>
        </div>
      </div>
      <h2 class="font-bold text-ui-primary text-base md:text-lg my-5">Описание товара</h2>
      <p>{{ item.description }}</p>
      <template v-if="item.simillar.length > 0">
        <h2 class="font-bold text-ui-primary text-base md:text-lg my-5">Похожие товары</h2>
        <Carousel :orientation="'horizontal'" :opts="{ align: 'start', dragFree: true, loop: true }"
          :plugins="[Autoplay({ delay: 2000 })]">
          <CarouselContent>
            <CarouselItem v-for="item in item.simillar" :key="item.id" class="basis-auto">
              <!-- @vue-ignore -->
              <UIProductCard :item="item" class="h-full" />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </template>
      <div class="flex gap-7 items-center my-5">
        <h2 class="font-bold text-ui-primary text-base md:text-lg ">Отзывы</h2>
        <Button @click="reviewModal" class="bg-ui-primary py-6 px-12 cursor-pointer">Оставить отзыв</Button>
      </div>
      <div v-if="item?.reviews?.length > 0" class="flex gap-10">
        <div class="flex flex-col gap-6 w-full">
          <div v-for="item in sortedReviews" class="border-2 border-ui-primary rounded-md p-6">
            <div class="flex gap-2 mb-4">
              <img src="/star.svg" v-for="i in item.reviews.rating" alt="">
              {{ item.username }}
            </div>
            <p>{{ item.reviews.description }}</p>
          </div>
        </div>
        <aside class="hidden md:block w-full max-w-[250px]">
          <h2 class="font-bold text-ui-primary text-lg mb-4">Сортировать:</h2>
          <RadioGroup v-model="sortType" :orientation="'vertical'">
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="r1" value="positive" />
              <Label class="text-base" for="r1">Сначала положительные</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="r2" value="negative" />
              <Label class="text-base" for="r2">Сначала отрицательные</Label>
            </div>
          </RadioGroup>
        </aside>
      </div>
      <p v-else>Оставьте первый отзыв к этому товару!</p>
    </UISection>
    <UISection v-else>
      <p class="text-center text-xl mt-20">Кажется, такого товара не существует! 😢</p>
    </UISection>
  </UiLoader>

</template>