<script setup lang="ts">
  import { Toaster } from './components/ui/sonner';

  const router = useRouter();
  const userStore = useUserStore();
  const res = await userStore.session();

  watch(() => userStore.isAuthenticated, (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      return router.push('/')
    }
  })
</script>

<template>
  <Toaster />
  <UIHeader />
  <main class="flex flex-col flex-1">
    <NuxtPage />
  </main>
  <UIFooter />
</template>

<style>
  body {
    font-family: 'Montserrat';
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    color: black;
  }

  body>#__nuxt {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
</style>