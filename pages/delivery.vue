<script setup>
  import { toast } from 'vue-sonner';

  const isLoading = ref(true);
  const data = ref([]);
  const userStore = useUserStore();

  onMounted(async () => {
    await getData();
  })

  const getData = async () => {
    isLoading.value = true;
    const res = await $fetch(`/api/orders/${userStore.user?.id}`);
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
      <h2 class="font-bold text-ui-primary text-xl md:text-2xl mb-5">Заказы</h2>
      <div class="flex flex-col gap-4">
        <template v-for="item in data">
          <CartItem :item @updated="getData" />
        </template>
      </div>
    </UISection>
  </UiLoader>
</template>