<script setup>
  import { getLocaleDate } from '#imports';
  import { ref } from 'vue';
  import { toast } from 'vue-sonner';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
  import EditCategoryModal from '../modals/EditCategoryModal.vue';
  import CreateCategoryModal from '../modals/CreateCategoryModal.vue';

  const categories = ref([]);
  const isLoading = ref(false);
  const selectedCategory = ref({});
  const isOpen = ref(false);
  const isCreateOpen = ref(false);

  const getCategories = async () => {
    isLoading.value = true;
    const data = await $fetch('/api/categories');
    isLoading.value = false

    if (data.statusCode === 200) {
      return categories.value = data.data
    }

    return toast.error('Ошибка', { description: 'Не удалось получить данные' })
  }

  await getCategories();

  const handleDeleteCategory = async (id) => {
    const data = await $fetch(`/api/categories/${id}`, { method: 'DELETE' });

    if (data.statusCode === 200) {
      toast.success('Категория удалена');
      return await getCategories();
    }

    return toast.error('Ошибка', { description: 'Не удалось удалить категорию' })
  }

  const handleEditCategory = (item) => {
    selectedCategory.value = item;
    isOpen.value = true;
  }
</script>

<template>
  <UiLoader :is-loading="isLoading">
    <EditCategoryModal :category="selectedCategory" v-model:is-open="isOpen" @updated="getCategories" />
    <CreateCategoryModal v-model:is-open="isCreateOpen" @created="getCategories" />
    <Button @click="isCreateOpen = true" class="mt-4 p-6 w-1/6 bg-ui-success text-lg cursor-pointer">
      Создать категорию
    </Button>
    <Table v-if="categories.length > 0" class="border rounded-lg mt-4">
      <TableHeader class="bg-ui-primary">
        <TableRow>
          <TableHead class="text-white rounded-tl-lg">Название</TableHead>
          <TableHead class="text-white">Дата создания</TableHead>
          <TableHead class="text-white">Дата обновления</TableHead>
          <TableHead class="text-white">Удалить</TableHead>
          <TableHead class="text-white rounded-tr-lg">Изменить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in categories" :key="item.id">
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ getLocaleDate(item.createdAt) }}</TableCell>
          <TableCell>{{ getLocaleDate(item.updatedAt) }}</TableCell>
          <TableCell>
            <img @click="handleDeleteCategory(item.id)" src="/delete.svg" alt="delete category"
              class="cursor-pointer ml-4">
          </TableCell>
          <TableCell>
            <img @click="handleEditCategory(item)" src="/edit.svg" alt="edit category" class="cursor-pointer ml-4">
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <template v-else>
      <p class="text-center">Здесь, пока что, нет данных</p>
    </template>
  </UiLoader>
</template>