<script setup lang="ts">
  import ChatModal from './components/modals/ChatModal.vue';
  import { Toaster } from './components/ui/sonner';

  const router = useRouter();
  const userStore = useUserStore();
  await userStore.session();
  const isVisible = ref(false);

  watch(() => userStore.isAuthenticated, (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      return router.push('/')
    }
  })
</script>

<template>
  <Toaster />
  <ChatModal v-model:is-visible="isVisible" />
  <UIHeader />
  <button @click="isVisible = true"
    class="fixed bottom-6 right-6 h-[60px] z-10 aspect-square cursor-pointer flex justify-center items-center p-4 bg-ui-primary rounded-full drop-shadow-xl drop-shadow-ui-primary/60">
    <img src="/chat.svg" alt="">
  </button>
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