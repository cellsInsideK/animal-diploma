<script setup lang="ts">
  import { toast } from 'vue-sonner';
  import type { SelectProducts } from '~/server/database/schema';
  import CreateProduct from '../modals/CreateProduct.vue';

  const isLoading = ref(true);
  const isCreateOpen = ref(false);
  const products = ref<SelectProducts[]>([]);

  onMounted(async () => {
    await getProducts();
  })

  const getProducts = async () => {
    isLoading.value = true;
    const data = await $fetch('/api/products');
    isLoading.value = false;

    if (data.statusCode === 200) {
      return products.value = data.data as SelectProducts[];
    }

    return toast.error('Ошибка', { description: data.message })
  }

  const handleCreateProduct = () => {
    isCreateOpen.value = true;
  }

  const handleDeleteProduct = (id: number) => {

  }

  const handleEditProduct = (item: SelectProducts) => {

  }
</script>

<template>
  <!-- <EditAdoptionModal :adoption="selectedAdoption" v-model:is-open="isOpen" @updated="getProducts" /> -->
  <CreateProduct v-model:is-open="isCreateOpen" @created="getProducts" />
  <UiLoader :is-loading="isLoading">
    <Button @click="handleCreateProduct" class="mt-4 p-6 w-1/6 bg-ui-success text-lg cursor-pointer">
      Создать товар
    </Button>
    <Table v-if="products.length > 0" class="border rounded-lg mt-4">
      <TableHeader class="bg-ui-primary">
        <TableRow>
          <TableHead class="text-white rounded-tl-lg">Название</TableHead>
          <TableHead class="text-white">Категория</TableHead>
          <TableHead class="text-white">Цена</TableHead>
          <TableHead class="text-white">Наличие</TableHead>
          <TableHead class="text-white">Дата создания</TableHead>
          <TableHead class="text-white">Дата обновления</TableHead>
          <TableHead class="text-white">Удалить</TableHead>
          <TableHead class="text-white w-fit rounded-tr-lg">Изменить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in products" :key="item.id">
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ productTypeEnum[item.type] }}</TableCell>
          <TableCell>{{ item.price }}</TableCell>
          <TableCell>{{ item.quantity }}</TableCell>
          <TableCell>{{ getLocaleDate(item.createdAt!) }}</TableCell>
          <TableCell>{{ getLocaleDate(item.updatedAt!) }}</TableCell>
          <TableCell>
            <img @click="handleDeleteProduct(item.id)" src="/delete.svg" alt="delete Product"
              class="cursor-pointer ml-4">
          </TableCell>
          <TableCell>
            <img @click="handleEditProduct(item)" src="/edit.svg" alt="edit Product" class="cursor-pointer ml-4">
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <template v-else>
      <p class="text-center">Здесь, пока что, нет данных</p>
    </template>
  </UiLoader>
</template>