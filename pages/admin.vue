<script setup lang="ts">
  import { useHead, useUserStore, watch, navigateTo, definePageMeta } from '#imports';
  import AdminAdoption from '~/components/admin/AdminAdoption.vue';

  import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
  useHead({ title: 'Админ панель' })
  const userStore = useUserStore();

  watch(() => userStore.isAuthenticated, (newVal) => {
    if (newVal === false) {
      return navigateTo('/')
    }
  })

  definePageMeta({ middleware: 'auth' });
</script>

<template>
  <UISection>
    <h1 class="text-ui-subtitle font-medium">Админ панель</h1>
    <Tabs default-value="orders" class="mt-4">
      <TabsList class="grid w-full grid-cols-5 gap-3">
        <TabsTrigger
          class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
          value="orders">Заказы</TabsTrigger>
        <TabsTrigger
          class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
          value="products">Товары</TabsTrigger>
        <TabsTrigger
          class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
          value="users">Пользователи</TabsTrigger>
        <TabsTrigger
          class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
          value="adoption">Пристройство</TabsTrigger>
        <TabsTrigger
          class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
          value="requests">Пристройство заявки</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        заказы
      </TabsContent>
      <TabsContent value="products">
        Товары
      </TabsContent>
      <TabsContent value="users">
        <AdminUsers />
      </TabsContent>
      <TabsContent value="adoption">
        <AdminAdoption />
      </TabsContent>
      <TabsContent value="requests">
        Пристройство заявки
      </TabsContent>
    </Tabs>
  </UISection>
</template>