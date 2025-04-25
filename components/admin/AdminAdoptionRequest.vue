<script setup>
  import { getLocaleDate } from '#imports';
  import { onMounted, ref } from 'vue';
  import { toast } from 'vue-sonner';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

  const requests = ref([]);

  const isLoading = ref(false);

  onMounted(async () => {
    await getRequests();
  })

  const getRequests = async () => {
    isLoading.value = true;
    const data = await $fetch('/api/adoption-request');
    isLoading.value = false

    if (data.statusCode === 200) {
      return requests.value = data.data
    }

    return toast.error('Ошибка', { description: 'Не удалось получить данные' })
  }

  const handleDeleteRequest = async (id) => {
    const data = await $fetch(`/api/adoption-request/${id}`, { method: 'DELETE' });

    if (data.statusCode === 200) {
      toast.success('Заявка удалена');
      return await getRequests();
    }

    return toast.error('Ошибка', { description: 'Не удалось удалить питомца' })
  }
</script>

<template>
  <UiLoader :is-loading="isLoading">
    <Table v-if="requests.length > 0" class="border rounded-lg mt-4">
      <TableHeader class="bg-ui-primary">
        <TableRow>
          <TableHead class="text-white rounded-tl-lg">Имя</TableHead>
          <TableHead class="text-white">Телефон</TableHead>
          <TableHead class="text-white">Питомец</TableHead>
          <TableHead class="text-white">Дата создания</TableHead>
          <TableHead class="text-white">Удалить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in requests" :key="item.id">
          <TableCell>{{ item.adoptionRequests.name }}</TableCell>
          <TableCell>{{ item.adoptionRequests.tel }}</TableCell>
          <TableCell>{{ item.adoptions.name }}</TableCell>
          <TableCell>{{ getLocaleDate(item.adoptionRequests.createdAt) }}</TableCell>
          <TableCell>
            <img @click="handleDeleteRequest(item.adoptionRequests.id)" src="/delete.svg" alt="delete adoption"
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