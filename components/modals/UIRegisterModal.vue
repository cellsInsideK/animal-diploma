<script setup lang="ts">
  import { Label } from '../ui/label';
  import { Input } from '../ui/input';
  import { Button } from '../ui/button';
  import { Dialog, DialogContent } from '../ui/dialog';
  import { toast } from 'vue-sonner';
  import type { SelectUsers } from '~/server/database/schema';

  const form = reactive({ login: '', email: '', password: '', confirmPassword: '' });
  const isVisible = defineModel<boolean>('is-visible');
  const loading = ref(false);
  const userStore = useUserStore();


  const handleRegister = async () => {
    if (form.login === '' || form.email === '' || form.password === '' || form.confirmPassword === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' })
    }

    if (!validateEmail(form.email))
      return toast.error('Ошибка', { description: 'Неверно указана почта' })

    if (form.password.length < 6)
      return toast.error('Ошибка', { description: 'Длина пароля должна быть от 6 символов' })

    if (form.password !== form.confirmPassword)
      return toast.error('Ошибка', { description: 'Пароли не совпадают' })

    loading.value = true;
    const data = await $fetch('/api/register', { body: form, method: 'POST' })
    loading.value = false;

    if (data.statusCode !== 200) {
      return toast.error('Ошибка', { description: data.message })
    }

    userStore.user = data.data as SelectUsers;

    toast.success(data.message);
    return isVisible.value = false;
  }
</script>

<template>
  <Dialog v-if="isVisible" v-model:open="isVisible">
    <DialogContent>
      <h2 class="text-center font-bold text-2xl">Регистрация</h2>
      <Label for="login" class="mt-2 font-semibold">Логин</Label>
      <Input class="border-2 border-ui-primary" v-model="form.login" id="login" type="login" placeholder="Логин" />
      <Label for="email" class="mt-2 font-semibold">E-mail</Label>
      <Input class="border-2 border-ui-primary" v-model="form.email" id="email" type="email"
        placeholder="mail@mail.com" />
      <Label for="password" class="mt-2 font-semibold">Пароль</Label>
      <Input class="border-2 border-ui-primary" v-model="form.password" id="password" type="password"
        placeholder="Введите ваш пароль (от 6 символов)" />
      <Label for="confirmPassword" class="mt-2 font-semibold">Подтвердите пароль</Label>
      <Input class="border-2 border-ui-primary" v-model="form.confirmPassword" id="confirmPassword" type="password"
        placeholder="Подтвердите пароль" />
      <Button :disabled="loading" variant="default" @click="handleRegister"
        class="bg-ui-primary w-full cursor-pointer">Зарегистрироваться</Button>
    </DialogContent>
  </Dialog>
</template>