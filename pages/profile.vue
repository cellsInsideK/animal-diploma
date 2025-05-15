<script setup>
  import { toast } from 'vue-sonner';

  const isLoading = ref(true);
  const data = ref([]);
  const items = ref([]);
  const userStore = useUserStore();
  const isFormLoading = ref(false);
  const form = reactive({ login: userStore.user.login, email: userStore.user.email, passwordHash: userStore.user.passwordHash, confirm: '' })

  onMounted(async () => {
    await getData();
  })

  const getData = async () => {
    isLoading.value = true;

    const [res1, res2] = await Promise.all([
      await $fetch(`/api/orders/${userStore.user?.id}`),
      await $fetch(`/api/favorites/${userStore.user?.id}`)
    ]);

    if (res1.statusCode !== 200) {
      return toast.error('Ошибка', { description: res1.message })
    }

    if (res2.statusCode !== 200) {
      return toast.error('Ошибка', { description: res2.message })

    }

    data.value = res1.data;
    items.value = res2.data;
    isLoading.value = false;
  }

  const handleSubmit = async () => {
    let dirtyPassword = false;

    if (form.email.trim() === '' || form.login.trim() === '' || form.passwordHash.trim() === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' });
    }

    if ((form.passwordHash !== userStore.user.passwordHash) && form.confirm.trim() === '') {
      return toast.error('Ошибка', { description: 'Необходимо повторить пароль' })
    }

    if ((form.passwordHash !== userStore.user.passwordHash) && form.confirm !== form.passwordHash) {
      return toast.error('Ошибка', { description: 'Пароли не совпадают' })
    }

    if (form.passwordHash !== userStore.user.passwordHash) {
      dirtyPassword = true;
    }

    isFormLoading.value = true;
    const res = await $fetch(`/api/user/${userStore.user.id}`, { method: 'PATCH', body: { dirtyPassword, ...form } });
    isFormLoading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    toast.success(res.message);
    return document.location.reload();
  }

  useHead({ title: 'Личный кабинет' })
  definePageMeta({ middleware: 'auth' });
</script>

<template>
  <UiLoader :is-loading="isLoading">
    <UISection>
      <h2 class="font-bold text-ui-primary text-xl md:text-2xl mb-5">Изменить личные данные</h2>
      <div>
        <Label for="login" class="font-semibold">Имя</Label>
        <Input v-model="form.login" id="login" type="text" class="mt-2 border-2 border-ui-primary max-w-sm"
          placeholder="Логин" />

        <Label for="email" class="mt-4 font-semibold">Email</Label>
        <Input v-model="form.email" id="email" type="email" class="mt-2 border-2 border-ui-primary max-w-sm"
          placeholder="mail@mail.com" />

        <Label for="password" class="mt-4 font-semibold">Пароль</Label>
        <Input v-model="form.passwordHash" id="password" type="password"
          class="mt-2 border-2 border-ui-primary max-w-sm" placeholder="Пароль" />

        <Label for="confirm" class="mt-4 font-semibold">Подтвердите пароль</Label>
        <Input v-model="form.confirm" id="confirm" type="password" class="mt-2 border-2 border-ui-primary max-w-sm"
          placeholder="Подтвердите пароль" />

        <Button @click="handleSubmit" :disabled="isFormLoading"
          class="mt-6 bg-ui-primary px-12 py-5 cursor-pointer">Сохранить</Button>
      </div>

      <Tabs default-value="orders" class="mt-8">
        <TabsList class="grid w-full max-w-lg grid-cols-2 gap-3">
          <TabsTrigger
            class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
            value="orders">Заказы</TabsTrigger>
          <TabsTrigger
            class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
            value="favorites">Избранное</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <div class="flex flex-col gap-4 mt-6">
            <template v-if="data.length > 0">
              <template v-for="item in data">
                <CartItem :item @updated="getData" />
              </template>
            </template>
            <template v-else>
              <p class="mt-6">Сделайте заказ и порадуйте своего питомца!</p>
            </template>
          </div>
        </TabsContent>
        <TabsContent value="favorites">
          <div class="flex gap-3 md:gap-12 flex-wrap w-full mt-6 justify-center md:justify-normal">
            <template v-if="items?.length > 0">
              <template v-for="item in items">
                <UIProductCard :item="item" class="min-h-full" />
              </template>
            </template>
            <template v-else>
              <p class="mt-6">Добавьте товар в избранное - порадуйте своего питомца!</p>
            </template>
          </div>
        </TabsContent>
      </Tabs>
    </UISection>
  </UiLoader>
</template>