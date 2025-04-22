<script setup lang="ts">

  useHead({ title: 'Пристройство питомцев' });
  const sort = ref<'' | 'dog' | 'cat'>('')
</script>

<template>
  <UISection>
    <h2 class="font-extrabold text-ui-primary text-lg md:text-3xl">Пристройство питомцев</h2>
    <div class="mt-7 flex flex-col md:flex-row gap-6">
      <Button class="bg-ui-primary py-6 px-16 w-fit cursor-pointer" @click="sort = 'dog'">Собаки</Button>
      <Button class="bg-ui-primary py-6 px-16 w-fit cursor-pointer" @click="sort = 'cat'">Кошки</Button>
    </div>
    <div class="flex flex-wrap mt-12 gap-24 justify-center">
      <NuxtLink class="flex flex-col gap-5 items-center">
        <img src="/dog.png" alt="">
        <p class="text-2xl font-bold">Шелти</p>
      </NuxtLink>
    </div>
  </UISection>
</template>