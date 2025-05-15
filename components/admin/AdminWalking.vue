<script setup>
  import { getLocaleDate } from '#imports';
  import { ref } from 'vue';
  import { toast } from 'vue-sonner';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
  import EditWalkingModal from '../modals/EditWalkingModal.vue';

  const walkings = ref([]);
  const isLoading = ref(false);
  const selectedWalking = ref({});
  const isOpen = ref(false);

  const getWalking = async () => {
    isLoading.value = true;
    const data = await $fetch('/api/walking');
    isLoading.value = false

    if (data.statusCode === 200) {
      return walkings.value = data.data
    }

    return toast.error('Ошибка', { description: 'Не удалось получить данные' })
  }

  await getWalking();

  const handleDeleteWalking = async (id) => {
    const data = await $fetch(`/api/walking/${id}`, { method: 'DELETE' });

    if (data.statusCode === 200) {
      toast.success('Заявка удалена');
      return await getWalking();
    }

    return toast.error('Ошибка', { description: 'Не удалось удалить заявку' })
  }

  const handleEditWalking = (item) => {
    selectedWalking.value = item;
    isOpen.value = true;
  }

  const statusEnum = {
    'process': 'Новый',
    'canceled': 'Отмененный',
    'accepted': 'Подтвержденный'
  }

  const getAnimalType = (type) => {
    switch (type) {
      case 'cat':
        return 'Кошка'
      case 'dog':
        return 'Собака'
      default:
        return type
    }
  }
</script>

<template>
  <UiLoader :is-loading="isLoading">
    <EditWalkingModal :walking="selectedWalking" v-model:is-open="isOpen" @updated="getWalking" />
    <Table v-if="walkings.length > 0" class="border rounded-lg mt-4">
      <TableHeader class="bg-ui-primary">
        <TableRow>
          <TableHead class="text-white rounded-tl-lg">Статус</TableHead>
          <TableHead class="text-white">Услуга</TableHead>
          <TableHead class="text-white">Имя</TableHead>
          <TableHead class="text-white">Телефон</TableHead>
          <TableHead class="text-white">Питомец</TableHead>
          <TableHead class="text-white max-w-[150px]">Комментарий</TableHead>
          <TableHead class="text-white">Дата записи</TableHead>
          <TableHead class="text-white">Время записи</TableHead>
          <TableHead class="text-white">Дата создания</TableHead>
          <TableHead class="text-white">Дата обновления</TableHead>
          <TableHead class="text-white">Удалить</TableHead>
          <TableHead class="text-white rounded-tr-lg">Изменить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in walkings" :key="item.id">
          <TableCell>{{ statusEnum[item.status] }}</TableCell>
          <TableCell>{{ item.type === 'walk' ? 'Выгул' : 'Передержка' }}</TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.tel }}</TableCell>
          <TableCell>{{ getAnimalType(item.animalType) }}</TableCell>
          <TableCell class="max-w-[150px] overflow-hidden" :title="item.comment">{{ item.comment }}</TableCell>
          <TableCell>{{ item.date ? item.date : '-' }}</TableCell>
          <TableCell>{{ item.time ? item.time : '-' }}</TableCell>
          <TableCell>{{ getLocaleDate(item.createdAt) }}</TableCell>
          <TableCell>{{ getLocaleDate(item.updatedAt) }}</TableCell>
          <TableCell>
            <img @click="handleDeleteWalking(item.id)" src="/delete.svg" alt="delete walking"
              class="cursor-pointer ml-4">
          </TableCell>
          <TableCell>
            <img @click="handleEditWalking(item)" src="/edit.svg" alt="edit walking" class="cursor-pointer ml-4">
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <template v-else>
      <p class="text-center">Здесь, пока что, нет данных</p>
    </template>
  </UiLoader>
</template>