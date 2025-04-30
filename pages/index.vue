<script setup>
  import Autoplay from 'embla-carousel-autoplay'

  const items = ref([]);
  const isLoading = ref(true);

  onMounted(async () => {
    const res = await $fetch('/api/products/find?limit=10');
    items.value = res.data;
    isLoading.value = false;
  })

  useHead({
    title: 'Тузик | Магазин для вашего питомца!'
  })

</script>

<template>
  <section
    class="container relative mx-auto flex justify-between items-center min-h-[420px] overflow-hidden max-h-[500px] w-full pl-3">
    <div class="flex flex-col justify-center ">
      <h1 class="font-extrabold text-3xl md:text-4xl text-ui-primary max-w-[475px] leading-16">
        Лучшая
        продукция для
        лучших друзей!
      </h1>
      <div class="flex flex-wrap gap-5 mt-6">
        <NuxtLink to="/services"
          class="text-md font-bold py-3 px-10 md:py-5 md:px-17 border-3 border-ui-primary rounded-xl text-ui-primary">
          Наши услуги
        </NuxtLink>
        <NuxtLink to="/products?sort=new&type= &name="
          class="text-md text-white font-bold py-3 px-10 md:py-5 md:px-17 border-3 border-ui-primary rounded-xl bg-ui-primary">
          Наши товары
        </NuxtLink>
      </div>
    </div>
    <img src="/hero.png"
      class=" max-w-fit overflow-hidden absolute -inset-10 opacity-40 lg:opacity-100 -z-1 h-fit w-fit lg:block lg:static"
      alt="">
  </section>
  <section class="container mx-auto my-8 pl-3" v-if="!isLoading">
    <h2 class="font-extrabold text-2xl text-ui-primary opacity-80 mb-9">Новинки в продаже</h2>
    <Carousel :orientation="'horizontal'" :opts="{ align: 'start', dragFree: true, loop: true }"
      :plugins="[Autoplay({ delay: 2000 })]">
      <CarouselContent>
        <CarouselItem v-for="item in items" :key="item.id" class="basis-auto">
          <!-- @vue-ignore -->
          <UIProductCard :item="item" class="h-full" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </section>
  <section class="container mx-auto my-8 pl-3">
    <h2 class="font-extrabold text-2xl text-ui-primary opacity-80 mb-9">Популярные категории</h2>
    <div class="flex flex-wrap md:flex-nowrap gap-5 items-center justify-center ">
      <NuxtLink :to="`/products?sort=new&type=dog&name=`"
        class="grid place-items-center bg-ui-primary rounded-xl w-full max-w-xs aspect-square">
        <img src="/dog.svg" alt="">
      </NuxtLink>
      <NuxtLink :to="`/products?sort=new&type=cat&name=`"
        class="grid place-items-center bg-ui-primary rounded-xl w-full max-w-xs aspect-square">
        <img src="/cat.svg" alt="">
      </NuxtLink>
      <NuxtLink :to="`/products?sort=new&type=rat&name=`"
        class="grid place-items-center bg-ui-primary rounded-xl w-full max-w-xs aspect-square">
        <img src="/hamster.svg" alt="">
      </NuxtLink>
    </div>
  </section>
</template>