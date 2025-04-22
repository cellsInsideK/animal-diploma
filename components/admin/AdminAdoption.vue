<script setup lang="ts">
  import { getLocaleDate } from '#imports';
  import { onMounted, ref } from 'vue';
  import { toast } from 'vue-sonner';
  import type { SelectAdoption } from '~/server/database/schema';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
  import EditUserModal from '../modals/EditUserModal.vue';
  import CreateAdoption from '../modals/CreateAdoption.vue';

  const adoptions = ref<SelectAdoption[]>([]);

  const isLoading = ref(false);
  const isOpen = ref(false);
  const isCreateOpen = ref(false);
  const selectedAdoption = ref<SelectAdoption>({} as SelectAdoption);

  onMounted(async () => {
    await getAdoptions();
  })

  const getAdoptions = async () => {
    isLoading.value = true;
    const data = await $fetch('/api/adoption');
    isLoading.value = false

    if (data.statusCode === 200) {
      return adoptions.value = data.data
    }

    return toast.error('Ошибка', { description: 'Не удалось получить данные' })
  }

  const handleDeleteAdoption = async (id: string) => {
    const data = await $fetch(`/api/adoption/${id}`, { method: 'DELETE' });

    if (data.statusCode === 200) {
      toast.success('Питомец удален');
      return await getAdoptions();
    }

    return toast.error('Ошибка', { description: 'Не удалось удалить питомца' })
  }

  const handleCreateAdoption = () => {
    isCreateOpen.value = true;
  }

  const handleEditAdoption = async (adoption: SelectAdoption) => {
    selectedAdoption.value = adoption;
    isOpen.value = true;
  }
</script>

<template>
  <!-- <EditUserModal :adoption="selectedAdoption" v-model:is-open="isOpen" @updated="getAdoptions" /> -->
  <CreateAdoption v-model:is-open="isCreateOpen" @created="getAdoptions" />
  <UiLoader :is-loading="isLoading">
    <Button @click="handleCreateAdoption" class="mt-4 p-6 w-1/6 bg-ui-success text-lg cursor-pointer">Создать
      питомца</Button>
    <Table v-if="adoptions.length > 0" class="border rounded-lg mt-4">
      <TableHeader class="bg-ui-primary">
        <TableRow>
          <TableHead class="text-white rounded-tl-lg">Кличка</TableHead>
          <TableHead class="text-white">Вид</TableHead>
          <TableHead class="text-white">Возраст</TableHead>
          <TableHead class="text-white">Описание</TableHead>
          <TableHead class="text-white">Изображение</TableHead>
          <TableHead class="text-white">Пол</TableHead>
          <TableHead class="text-white">Дата создания</TableHead>
          <TableHead class="text-white">Дата обновления</TableHead>
          <TableHead class="text-white">Удалить</TableHead>
          <TableHead class="text-white w-fit rounded-tr-lg">Изменить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in adoptions" :key="item.id">
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.type === 'dog' ? 'Собака' : 'Кошка' }}</TableCell>
          <TableCell>{{ item.age }}</TableCell>
          <TableCell class="max-w-[250px] overflow-hidden">{{ item.description }}</TableCell>
          <TableCell>{{ item.image }}</TableCell>
          <TableCell>{{ item.sex === 'male' ? 'Мальчик' : 'Девочка' }}</TableCell>
          <TableCell>{{ getLocaleDate(item.createdAt!) }}</TableCell>
          <TableCell>{{ getLocaleDate(item.updatedAt!) }}</TableCell>
          <TableCell>
            <img @click="handleDeleteAdoption(item.id)" src="/delete.svg" alt="delete adoption"
              class="cursor-pointer ml-4">
          </TableCell>
          <TableCell>
            <img @click="handleEditAdoption(item)" src="/edit.svg" alt="edit adoption" class="cursor-pointer ml-4">
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <template v-else>
      <p class="text-center">Здесь, пока что, нет данных</p>
    </template>
  </UiLoader>
</template>