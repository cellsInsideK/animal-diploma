<script setup lang='ts'>
  import { toast } from 'vue-sonner';

  const form = reactive({ email: '', password: '' });
  const loading = ref(false);
  const isVisible = defineModel<boolean>('is-visible');
  const userStore = useUserStore();

  const handleRegister = async () => {
    if (form.email === '' || form.password === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' })
    }

    loading.value = true;
    const res = await userStore.login(form.email, form.password);
    loading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message })
    }

    toast.success(res.message);
    return isVisible.value = false;
  }
</script>

<template>
  <Dialog v-if="isVisible" v-model:open="isVisible">
    <DialogContent>
      <h2 class="text-center font-bold text-2xl">Авторизация</h2>
      <Label for="email" class="mt-2 font-semibold">E-mail</Label>
      <Input class="border-2 border-ui-primary" v-model="form.email" id="email" type="email"
        placeholder="mail@mail.com" />
      <Label for="password" class="mt-2 font-semibold">Пароль</Label>
      <Input class="border-2 border-ui-primary" v-model="form.password" id="password" type="password"
        placeholder="Введите ваш пароль (от 6 символов)" />
      <Button :disabled="loading" variant="default" @click="handleRegister"
        class="bg-ui-primary w-full cursor-pointer">Войти</Button>
    </DialogContent>
  </Dialog>
</template>