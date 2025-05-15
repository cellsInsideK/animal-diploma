<script setup lang="ts">
  import { toast } from 'vue-sonner';
  import GroomingModal from '~/components/modals/GroomingModal.vue';
  import GroominReviewModal from '~/components/modals/GroominReviewModal.vue';
  import type { SelectGroomingReviews } from '~/server/database/schema';

  type Sort = 'positive' | 'negative';
  type Reviews = { username: string, groomingReviews: SelectGroomingReviews };

  const isVisible = ref(false);
  const items = ref<string[]>([]);
  const reviews = ref<Reviews[]>([]);
  const sortType = ref<Sort>('positive');
  const userStore = useUserStore();
  const isModalVisible = ref(false);

  const sortedReviews = computed(() => {
    switch (sortType.value) {
      case 'positive':
        return reviews.value.sort((a, b) => {
          if (a.groomingReviews.rating > b.groomingReviews.rating) return -1;
          if (a.groomingReviews.rating < b.groomingReviews.rating) return 1;
          return 0
        })
      case 'negative':
        return reviews.value.sort((a, b) => {
          if (a.groomingReviews.rating < b.groomingReviews.rating) return -1;
          if (a.groomingReviews.rating > b.groomingReviews.rating) return 1;
          return 0
        })
    }
  })

  const getData = async () => {
    const res = await $fetch('/api/grooming-review');

    //@ts-ignore
    reviews.value = res.data;
  }

  onMounted(async () => {
    await getData();
  })

  const reviewModal = () => {
    if (!userStore.isAuthenticated) {
      return toast.error('Ошибка', { description: 'Необходимо авторизоваться' })
    }

    return isModalVisible.value = true;
  }

  const handleDeleteReview = async (id: string) => {
    const res = await $fetch(`/api/grooming-review/${id}`, { method: 'DELETE' });

    if (res.statusCode !== 200) {
      return toast.error("Ошибка", { description: res.message })
    }

    toast.success(res.message);
    return await getData()
  }

  const addItem = (item: string) => {
    if (items.value.includes('Комплекс') && item !== 'Комплекс') {
      return
    }

    if (!items.value.includes('Комплекс') && item === 'Комплекс') {
      return items.value = ['Комплекс']
    }

    if (items.value.includes(item)) {
      return items.value = items.value.filter(val => val !== item)
    }

    return items.value.push(item)
  }

  const handleSubmit = () => {
    if (items.value.length === 0) {
      return toast.error('Необходимо выбрать хотя бы 1 услугу')
    }

    return isVisible.value = true
  }

  useHead({ title: 'Грумминг' });
</script>

<template>
  <UISection>
    <GroominReviewModal v-model:is-visible="isModalVisible" @created="getData" />
    <GroomingModal :items="items" v-model:is-visible="isVisible" />
    <h2 class="font-bold text-ui-primary text-xl md:text-2xl mb-5">Грумминг</h2>
    <img src="/grooming.png" class="w-full max-h-[400px] rounded-md mb-5" alt="">
    <h3 class="font-bold text-ui-primary text-xl md:text-2xl mb-5">Что это такое?</h3>
    <p class="font-semibold text-lg text-justify mb-5">
      Груминг — это профессиональный уход за внешним видом питомца: стрижка, мытьё, расчёсывание, уход за когтями, ушами
      и кожей. Регулярные процедуры не только делают собаку или кошку аккуратной и опрятной, но и помогают избежать
      проблем со здоровьем: колтунов, воспалений, грибка и неприятного запаха. Наши специалисты работают бережно, с
      любовью и знанием особенностей каждой породы. Груминг — это не просто уход, а забота и комфорт для вашего любимца.
    </p>
    <h3 class="font-bold text-ui-primary text-xl md:text-2xl mb-5">Прайс лист</h3>
    <div class="flex flex-col md:flex-row justify-center items-center gap-5 mb-5">
      <div @click="addItem('Комплекс')"
        class="relative flex flex-col cursor-pointer border-2 border-ui-primary rounded-lg px-5 py-8 w-[250px] h-[300px]">
        <h3 class="text-center text-ui-primary text-xl font-bold mb-4">Комплекс</h3>
        <p class="text-justify text-sm font-semibold">
          Полный уход за питомцем: мытьё, сушка, стрижка, расчёсывание, уход за когтями и ушами. Всё включено — удобно и
          выгодно.
        </p>
        <h3 class="text-center text-ui-primary font-bold text-3xl mt-auto">2 500 ₽</h3>
        <div class="absolute size-4 top-2 left-2 rounded-full border-2 border-ui-primary"
          :class="items.includes('Комплекс') ? 'bg-ui-primary' : ''"></div>
      </div>
      <div @click="addItem('Когти и уши')"
        class="relative flex flex-col cursor-pointer border-2 border-ui-primary rounded-lg px-5 py-8 w-[250px] h-[300px]">
        <h3 class="text-center text-ui-primary text-xl font-bold mb-4">Когти и уши</h3>
        <p class="text-justify text-sm font-semibold">
          Аккуратная подрезка когтей, чистка ушей и удаление лишней шерсти — комфорт и здоровье вашего питомца.
        </p>
        <h3 class="text-center text-ui-primary font-bold text-3xl mt-auto">600 ₽</h3>
        <div class="absolute size-4 top-2 left-2 rounded-full border-2 border-ui-primary"
          :class="items.includes('Когти и уши') ? 'bg-ui-primary' : ''"></div>
      </div>
      <div @click="addItem('Тримминг')"
        class="relative flex flex-col cursor-pointer border-2 border-ui-primary rounded-lg px-5 py-8 w-[250px] h-[300px]">
        <h3 class="text-center text-ui-primary text-xl font-bold mb-4">Тримминг</h3>
        <p class="text-justify text-sm font-semibold">
          Удаление шерсти у жёсткошёрстных пород. Без боли и стресса, с соблюдением стандартов.
        </p>
        <h3 class="text-center text-ui-primary font-bold text-3xl mt-auto">1 800 ₽</h3>
        <div class="absolute size-4 top-2 left-2 rounded-full border-2 border-ui-primary"
          :class="items.includes('Тримминг') ? 'bg-ui-primary' : ''"></div>
      </div>
      <div @click="addItem('Мытьё и сушка')"
        class="relative flex flex-col cursor-pointer border-2 border-ui-primary rounded-lg px-5 py-8 w-[250px] h-[300px]">
        <h3 class="text-center text-ui-primary text-xl font-bold mb-4">Мытьё и сушка</h3>
        <p class="text-justify text-sm font-semibold">
          Глубокое очищение шерсти с использованием зоошампуней, сушка и расчёсывание. Подходит для всех пород.
        </p>
        <h3 class="text-center text-ui-primary font-bold text-3xl mt-auto">1 200 ₽</h3>
        <div class="absolute size-4 top-2 left-2 rounded-full border-2 border-ui-primary"
          :class="items.includes('Мытьё и сушка') ? 'bg-ui-primary' : ''"></div>
      </div>
    </div>
    <div class="flex justify-center w-full">
      <Button @click="handleSubmit" class="w-fit px-12 py-5 bg-ui-primary cursor-pointer">Записаться</Button>
    </div>
    <div class="flex gap-7 items-center my-5">
      <h2 class="font-bold text-ui-primary text-base md:text-lg ">Отзывы</h2>
      <Button @click="reviewModal" class="bg-ui-primary py-6 px-12 cursor-pointer">Оставить отзыв</Button>
    </div>
    <div v-if="reviews?.length > 0" class="flex gap-10">
      <div class="flex flex-col gap-6 w-full">
        <div v-for="item in sortedReviews" class="border-2 border-ui-primary rounded-md p-6">
          <div class="flex gap-2 mb-4">
            <img src="/star.svg" v-for="i in item.groomingReviews.rating" alt="">
            {{ item.username }}
            <img v-if="userStore.isAuthenticated && userStore.user?.isAdmin"
              @click="handleDeleteReview(item.groomingReviews.id)" class="ml-auto cursor-pointer" src="/delete.svg"
              alt="">
          </div>
          <p>{{ item.groomingReviews.description }}</p>
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
</template>