<script setup lang="ts">
  import type { SelectAdoption } from '~/server/database/schema';

  const adoptions = ref<SelectAdoption[]>([]);
  const loading = ref(true);
  const { data } = await $fetch<{ statusCode: number, data: SelectAdoption[] }>('/api/adoption');
  adoptions.value = data;
  loading.value = false;

  const sortedAdoptions = computed(() => {
    if (sort.value !== '') {
      return adoptions.value.filter(item => item.type === sort.value);
    }
    return adoptions.value;
  })

  useHead({ title: 'Пристройство питомцев' });
  const sort = ref<'' | 'dog' | 'cat'>('');
</script>

<template>
  <UiLoader :is-loading="loading">
    <UISection>
      <h2 class="font-extrabold text-ui-primary text-lg md:text-3xl">Пристройство питомцев</h2>
      <div class="mt-7 flex flex-col md:flex-row gap-6">
        <Button class="bg-ui-primary py-6 px-16 w-fit cursor-pointer" @click="sort = 'dog'">Собаки</Button>
        <Button class="bg-ui-primary py-6 px-16 w-fit cursor-pointer" @click="sort = 'cat'">Кошки</Button>
      </div>
      <div class="flex flex-wrap mt-12 gap-24 justify-center">
        <template v-for="adoption in sortedAdoptions">
          <NuxtLink :to="`/adoption/${adoption.id}`" class="flex flex-col gap-5 items-center">
            <img :src="getImageUrl(adoption.image)" :alt="adoption.name" class="rounded-md">
            <p class="text-2xl font-bold">{{ adoption.name }}</p>
          </NuxtLink>
        </template>
      </div>
    </UISection>
  </UiLoader>
</template>