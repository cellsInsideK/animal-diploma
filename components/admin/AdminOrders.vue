<script setup>
  import { toast } from 'vue-sonner';

  const isLoading = ref(true);
  const data = ref([]);
  const sort = ref('')
  const sortedData = computed(() => {
    if (sort.value === 'canceled') {
      return data.value.filter(item => item.order.status === 'canceled' && item.order.isVisible === true)
    }

    if (sort.value === 'accepted') {
      return data.value.filter(item => item.order.status === 'accepted' && item.order.isVisible === true)
    }

    return data.value
  })

  onMounted(async () => {
    await getData();
  })

  const getData = async () => {
    isLoading.value = true;
    const res = await $fetch(`/api/orders`);
    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message })
    }
    data.value = res.data;
    isLoading.value = false;
  }

  definePageMeta({ middleware: 'auth' });
</script>

<template>
  <UiLoader :is-loading="isLoading">
    <UISection>
      <div class="flex gap-5 items-center mb-4">
        <h2 class="font-bold text-ui-primary text-2xl">Сортировка:</h2>
        <Button @click="sort = ''" class="bg-ui-primary px-12 py-7 cursor-pointer">Новые</Button>
        <Button @click="sort = 'accepted'" class="bg-ui-primary px-12 py-7 cursor-pointer">Подтвержденные</Button>
        <Button @click="sort = 'canceled'" class="bg-ui-primary px-12 py-7 cursor-pointer">Отмененные</Button>
      </div>
      <div v-if="sortedData.length > 0" class="flex flex-col gap-4">
        <template v-for="item in sortedData">
          <CartItem :item :admin="true" @updated="getData" />
        </template>
      </div>
      <p v-else>Ничего не найдено</p>
    </UISection>
  </UiLoader>
</template>