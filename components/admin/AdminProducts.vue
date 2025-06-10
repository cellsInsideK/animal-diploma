<script setup>
  import { toast } from 'vue-sonner';
  import CreateProduct from '../modals/CreateProduct.vue';
  import EditProductModal from '../modals/EditProductModal.vue';

  const isLoading = ref(true);
  const isCreateOpen = ref(false);
  const isOpen = ref(false);
  const selectedProduct = ref({});
  const products = ref([]);

  const getProducts = async () => {
    isLoading.value = true;
    const data = await $fetch('/api/products');
    isLoading.value = false;

    if (data.statusCode === 200) {
      return products.value = data.data;
    }

    return toast.error('Ошибка', { description: data.message })
  }

  await getProducts();

  const handleCreateProduct = () => {
    isCreateOpen.value = true;
  }

  const handleDeleteProduct = async (id) => {
    const res = await $fetch(`/api/products/${id}`, { method: 'DELETE' });

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    toast.success(res.message);
    return await getProducts();
  }

  const handleEditProduct = (item) => {
    selectedProduct.value = item;
    isOpen.value = true;
  }
</script>

<template>
  <EditProductModal :product="selectedProduct" v-model:is-open="isOpen" @updated="getProducts" />
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
        <TableRow v-for="item in products" :key="item.products.id">
          <TableCell>{{ item.products.name }}</TableCell>
          <TableCell>{{ item.category.name }}</TableCell>
          <TableCell>{{ item.products.price }}</TableCell>
          <TableCell>{{ item.products.quantity }}</TableCell>
          <TableCell>{{ getLocaleDate(item.products.createdAt) }}</TableCell>
          <TableCell>{{ getLocaleDate(item.products.updatedAt) }}</TableCell>
          <TableCell>
            <img @click="handleDeleteProduct(item.products.id)" src="/delete.svg" alt="delete Product"
              class="cursor-pointer ml-4">
          </TableCell>
          <TableCell>
            <img @click="handleEditProduct(item.products)" src="/edit.svg" alt="edit Product"
              class="cursor-pointer ml-4">
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <template v-else>
      <p class="text-center">Здесь, пока что, нет данных</p>
    </template>
  </UiLoader>
</template>