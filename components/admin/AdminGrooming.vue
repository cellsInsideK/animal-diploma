<script setup>
  import { getLocaleDate } from '#imports';
  import { ref } from 'vue';
  import { toast } from 'vue-sonner';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
  import EditGroomingModal from '../modals/EditGroomingModal.vue';

  const groomings = ref([]);
  const isLoading = ref(false);
  const selectedGrooming = ref({});
  const isOpen = ref(false);

  const getGrooming = async () => {
    isLoading.value = true;
    const data = await $fetch('/api/grooming');
    isLoading.value = false

    if (data.statusCode === 200) {
      return groomings.value = data.data
    }

    return toast.error('Ошибка', { description: 'Не удалось получить данные' })
  }

  await getGrooming();

  const handleDeleteGrooming = async (id) => {
    const data = await $fetch(`/api/grooming/${id}`, { method: 'DELETE' });

    if (data.statusCode === 200) {
      toast.success('Заявка удалена');
      return await getGrooming();
    }

    return toast.error('Ошибка', { description: 'Не удалось удалить заявку' })
  }

  const handleEditGroomin = (item) => {
    selectedGrooming.value = item;
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
    <EditGroomingModal :grooming="selectedGrooming" v-model:is-open="isOpen" @updated="getGrooming" />
    <Table v-if="groomings.length > 0" class="border rounded-lg mt-4">
      <TableHeader class="bg-ui-primary">
        <TableRow>
          <TableHead class="text-white rounded-tl-lg">Статус</TableHead>
          <TableHead class="text-white">Услуга</TableHead>
          <TableHead class="text-white">Имя</TableHead>
          <TableHead class="text-white">Телефон</TableHead>
          <TableHead class="text-white">Сведения о питомце</TableHead>
          <TableHead class="text-white max-w-[150px]">Комментарий</TableHead>
          <TableHead class="text-white">Дата создания</TableHead>
          <TableHead class="text-white">Дата обновления</TableHead>
          <TableHead class="text-white">Удалить</TableHead>
          <TableHead class="text-white rounded-tr-lg">Изменить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in groomings" :key="item.id">
          <TableCell>{{ statusEnum[item.status] }}</TableCell>
          <TableCell class="max-w-[150px] overflow-hidden" :title="item.items">{{ item.items }}</TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.tel }}</TableCell>
          <TableCell class="max-w-[150px] overflow-hidden"
            :title="`${getAnimalType(item.animalType)} ${item.breed}, ${item.age}`">{{
              `${getAnimalType(item.animalType)} ${item.breed}, ${item.age}` }}</TableCell>
          <TableCell class="max-w-[150px] overflow-hidden" :title="item.comment">{{ item.comment ? item.comment : '-' }}
          </TableCell>
          <TableCell>{{ getLocaleDate(item.createdAt) }}</TableCell>
          <TableCell>{{ getLocaleDate(item.updatedAt) }}</TableCell>
          <TableCell>
            <img @click="handleDeleteGrooming(item.id)" src="/delete.svg" alt="delete walking"
              class="cursor-pointer ml-4">
          </TableCell>
          <TableCell>
            <img @click="handleEditGroomin(item)" src="/edit.svg" alt="edit walking" class="cursor-pointer ml-4">
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <template v-else>
      <p class="text-center">Здесь, пока что, нет данных</p>
    </template>
  </UiLoader>
</template>