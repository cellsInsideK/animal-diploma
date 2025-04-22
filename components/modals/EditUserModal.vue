<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { toast } from 'vue-sonner';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

  import { Button } from '../ui/button';
  import { Input } from '../ui/input';
  import { Label } from '../ui/label';
  import type { SelectUsers } from '~/server/database/schema';

  const { user } = defineProps<{ user: SelectUsers }>();
  const isOpen = defineModel<boolean>('isOpen');
  const emit = defineEmits<{
    (e: 'updated'): void
  }>();

  const form = reactive<SelectUsers>({} as SelectUsers);

  watch(() => user, (newUser) => {
    form.id = newUser.id;
    form.login = newUser.login;
    form.email = newUser.email;
    form.passwordHash = newUser.passwordHash;
    form.isAdmin = newUser.isAdmin;
    form.createdAt = newUser.createdAt;
    form.updatedAt = newUser.updatedAt;
  })

  const isFormLoading = ref(false);

  const handleSubmit = async () => {
    let dirtyPassword = false;

    if (form.email.trim() === '' || form.login.trim() === '' || form.passwordHash.trim() === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' });
    }

    if (form.passwordHash !== user.passwordHash) {
      dirtyPassword = true;
    }

    isFormLoading.value = true;
    const res = await $fetch(`/api/user/${user.id}`, { method: 'PATCH', body: { dirtyPassword, ...form } });
    isFormLoading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    toast.success(res.message);
    emit('updated')
    return isOpen.value = false;
  }
</script>

<template>
  <Dialog v-model:open="isOpen" class="p-5">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Изменение пользователя</DialogTitle>
        <DialogDescription>
          Заполните все поля для изменения пользвоателя
        </DialogDescription>
      </DialogHeader>

      <Label for="login">Логин</Label>
      <Input class="border-2 border-ui-primary" v-model="form.login" id="login" type="text"
        placeholder="Введите логин пользователя" />

      <Label for="email">Email</Label>
      <Input class="border-2 border-ui-primary" v-model="form.email" id="email" type="text"
        placeholder="Введите email пользователя" />

      <Label for="passwordHash">Пароль</Label>
      <Input class="border-2 border-ui-primary" v-model="form.passwordHash" id="passwordHash" type="text"
        placeholder="Введите пароль пользователя" />

      <Label>Админ</Label>
      <input v-model="form.isAdmin" type="checkbox"></input>
      <DialogFooter>
        <Button @click="handleSubmit" :disabled="isFormLoading"
          class="w-full shadow-lg shadow-slate-400 bg-ui-primary cursor-pointer">Изменить
          пользователя</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>