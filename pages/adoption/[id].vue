<script setup lang="ts">
  import { toast } from 'vue-sonner';
  import AdoptionRequest from '~/components/modals/AdoptionRequest.vue';
  import type { SelectAdoption } from '~/server/database/schema';

  const { id } = useRoute().params;
  const animal = ref<SelectAdoption>();
  const openModal = ref(false);
  const data = await $fetch<{ statusCode: number, data: SelectAdoption }>(`/api/adoption/${id}`);

  if (data.statusCode !== 200) {
    toast.error('Ошибка получения данных');
  }
  animal.value = data.data;

  useHead({ title: animal.value?.name });
</script>

<template>
  <AdoptionRequest v-model:is-visible="openModal" :id="animal?.id!" />
  <UISection>
    <h1 class="text-ui-primary font-extrabold text-xl md:text-3xl">{{ animal?.name }}</h1>
    <div class="mt-4 flex flex-col gap-7 md:gap-24 md:flex-row">
      <img :src="getImageUrl(animal?.image!)" :alt="animal?.name" class="w-full rounded-md">
      <div>
        <h2 class="text-ui-primary font-medium text-xl md:text-2xl mb-7">{{ animal?.sex === 'male' ? 'Мальчик' :
          'Девочка' }}, {{
            animal?.age }}.</h2>
        <p class="text-xl mb-5">{{ animal?.description }}</p>
        <Button @click="openModal = true" class="bg-ui-primary py-6 px-12 w-full md:w-fit cursor-pointer">Забрать
          питомца</Button>
      </div>
    </div>
  </UISection>
</template>