<script setup lang="ts">
  import { useHead, useUserStore, watch, navigateTo, definePageMeta } from '#imports';
  import AdminAdoption from '~/components/admin/AdminAdoption.vue';
  import AdminAdoptionRequest from '~/components/admin/AdminAdoptionRequest.vue';
  import AdminProducts from '~/components/admin/AdminProducts.vue';

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
    <Tabs default-value="orders" class="mt-4">
      <TabsList class="grid w-full h-full grid-cols-5 grid-rows-2 gap-3">
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
        <TabsTrigger
          class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
          value="category">Категории</TabsTrigger>
        <TabsTrigger
          class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
          value="grooming">Грумминг заявки</TabsTrigger>
        <TabsTrigger
          class="bg-ui-primary p-2 text-white rounded-md text-md cursor-pointer data-[state=active]:text-ui-primary data-[state=active]:shadow-slate-400"
          value="walking">Выгул и передержка</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        <AdminOrders />
      </TabsContent>
      <TabsContent value="products">
        <AdminProducts />
      </TabsContent>
      <TabsContent value="users">
        <AdminUsers />
      </TabsContent>
      <TabsContent value="adoption">
        <AdminAdoption />
      </TabsContent>
      <TabsContent value="requests">
        <AdminAdoptionRequest />
      </TabsContent>
      <TabsContent value="category">
        <AdminCategories />
      </TabsContent>
      <TabsContent value="grooming">
        <AdminGrooming />
      </TabsContent>
      <TabsContent value="walking">
        <AdminWalking />
      </TabsContent>
    </Tabs>
  </UISection>
</template>