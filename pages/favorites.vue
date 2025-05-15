<script setup lang="ts">
  const items = ref([])
  const loading = ref(true);
  const userStore = useUserStore();

  const getData = async () => {
    loading.value = true;
    const res = await $fetch(`/api/favorites/${userStore.user?.id}`)
    //@ts-ignore
    items.value = res.data;
    loading.value = false;
  }

  onMounted(async () => {
    await getData();
  })

  definePageMeta({ middleware: 'auth' })
</script>

<template>
  <UiLoader :is-loading="loading">
    <UISection>
      <h2 class="font-bold text-ui-primary text-xl md:text-2xl mb-5">Избранное</h2>
      <div class="flex gap-12 flex-wrap w-full">
        <template v-if="items?.length > 0">
          <template v-for="item in items">
            <UIProductCard :item="item" />
          </template>
        </template>
        <template v-else>Добавьте товар в избранное - порадуйте своего питомца!</template>
      </div>
    </UISection>
  </UiLoader>
</template>