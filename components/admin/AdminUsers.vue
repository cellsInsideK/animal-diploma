<script setup lang="ts">
  import { getLocaleDate } from '#imports';
  import { ref } from 'vue';
  import { toast } from 'vue-sonner';
  import type { SelectUsers } from '~/server/database/schema';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
  import EditUserModal from '../modals/EditUserModal.vue';

  const users = ref<SelectUsers[]>([]);

  const isLoading = ref(false);
  const isOpen = ref(false);
  const selectedUser = ref<SelectUsers>({} as SelectUsers);

  const getUsers = async () => {
    isLoading.value = true;
    const data = await $fetch('/api/user');
    isLoading.value = false

    if (data.statusCode === 200) {
      return users.value = data.data
    }

    return toast.error('Ошибка', { description: 'Не удалось получить данные' })
  }

  await getUsers();

  const handleDeleteUser = async (id: string) => {
    const data = await $fetch(`/api/user/${id}`, { method: 'DELETE' });

    if (data.statusCode === 200) {
      toast.success('Пользователь удален');
      return await getUsers();
    }

    return toast.error('Ошибка', { description: 'Не удалось удалить пользователя' })
  }

  const handleEditUser = async (user: SelectUsers) => {
    selectedUser.value = user;
    isOpen.value = true;
  }
</script>

<template>
  <EditUserModal :user="selectedUser" v-model:is-open="isOpen" @updated="getUsers" />
  <UiLoader :is-loading="isLoading">
    <Table v-if="users.length > 0" class="border rounded-lg mt-4">
      <TableHeader class="bg-ui-primary">
        <TableRow>
          <TableHead class="text-white rounded-tl-lg">Логин</TableHead>
          <TableHead class="text-white">Email</TableHead>
          <TableHead class="text-white w-[100px]">Пароль</TableHead>
          <TableHead class="text-white">Админ</TableHead>
          <TableHead class="text-white">Дата создания</TableHead>
          <TableHead class="text-white">Дата обновления</TableHead>
          <TableHead class="text-white">Удалить</TableHead>
          <TableHead class="text-white w-fit rounded-tr-lg">Изменить</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in users" :key="item.id">
          <TableCell>{{ item.login }}</TableCell>
          <TableCell>{{ item.email }}</TableCell>
          <TableCell class="break-all">{{ item.passwordHash }}</TableCell>
          <TableCell>{{ item.isAdmin ? 'Да' : 'Нет' }}</TableCell>
          <TableCell>{{ getLocaleDate(item.createdAt!) }}</TableCell>
          <TableCell>{{ getLocaleDate(item.updatedAt!) }}</TableCell>
          <TableCell>
            <img @click="handleDeleteUser(item.id)" src="/delete.svg" alt="delete user" class="cursor-pointer ml-4">
          </TableCell>
          <TableCell>
            <img @click="handleEditUser(item)" src="/edit.svg" alt="edit user" class="cursor-pointer ml-4">
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <template v-else>
      <p class="text-center">Здесь, пока что, нет данных</p>
    </template>
  </UiLoader>
</template>