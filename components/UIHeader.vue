<script setup lang="ts">
  import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
  import UIRegisterModal from './modals/UIRegisterModal.vue';
  import LoginModal from './modals/LoginModal.vue';

  const userStore = useUserStore();
  const registerVisible = ref(false);
  const loginVisible = ref(false);
  const router = useRouter();
  const input = ref('');

  const openRegister = () => {
    registerVisible.value = true;
  }

  const openLogin = () => {
    loginVisible.value = true;
  }

  const submitInput = () => {
    if (Number.isInteger(+input.value) && input.value !== '') {
      router.push(`/products/${+input.value}`)
      return input.value = ''
    }
    router.push(`/products?sort=new&type= &name=${input.value}`)
    return input.value = ''
  }
</script>

<template>
  <UIRegisterModal v-model:is-visible="registerVisible" />
  <LoginModal v-model:is-visible="loginVisible" />
  <header class="bg-ui-primary p-6">
    <div class="container mx-auto">
      <div class="flex gap-4 items-center justify-between">
        <NuxtLink to="/">
          <img src="/logo.svg" class="" alt="">
        </NuxtLink>
        <Popover>
          <PopoverTrigger>
            <img src="/burger.svg" class="block md:hidden" alt="">
          </PopoverTrigger>
          <PopoverContent>
            <div class="flex flex-col gap-4 text-lg">
              <NuxtLink class="!no-underline py-1" to="/">Главная</NuxtLink>
              <NuxtLink class="!no-underline py-1" to="/services">Услуги
              </NuxtLink>
              <NuxtLink class="!no-underline py-1" to="/products?sort=new&type= &name=">Товары
              </NuxtLink>
              <template v-if="!userStore.isAuthenticated">
                <button class="w-fit py-1" @click="openLogin">Вход</button>
                <button class="w-fit py-1" @click="openRegister">Регистрация</button>
              </template>
              <template v-else>
                <button class="w-fit py-1" @click="userStore.logout">Выйти</button>
              </template>
              <NuxtLink class="!no-underline py-1" to="/delivery">Заказы</NuxtLink>
            </div>
          </PopoverContent>
        </Popover>
        <nav class="hidden md:flex gap-12 text-base lg:text-lg">
          <NuxtLink class="text-white font-extrabold" to="/">Главная</NuxtLink>
          <NuxtLink class="text-white font-extrabold" to="/services">Услуги
          </NuxtLink>
          <NuxtLink class="text-white font-extrabold" to="/products?sort=new&type= &name=">Товары
          </NuxtLink>

          <ClientOnly>
            <Popover v-if="!userStore.isAuthenticated">
              <PopoverTrigger class="cursor-pointer">
                <div class="flex gap-9">
                  <p class="text-white font-extrabold">Вход</p>
                  <img src="/arrow.svg" alt="">
                </div>
              </PopoverTrigger>
              <PopoverContent class="flex flex-col gap-4 w-fit p-4 font-extrabold">
                <button class=" cursor-pointer" @click="openLogin">Вход</button>
                <button class=" cursor-pointer" @click="openRegister">Регистрация</button>
              </PopoverContent>
            </Popover>

            <button v-else class="text-white font-extrabold cursor-pointer" @click="userStore.logout">Выйти</button>
            <NuxtLink v-if="userStore.isAuthenticated && !userStore.user?.isAdmin" class="text-white font-extrabold"
              to="/delivery">Заказы
            </NuxtLink>
            <NuxtLink v-else-if="userStore.isAuthenticated && userStore.user?.isAdmin" class="text-white font-extrabold"
              to="/admin">Админ панель</NuxtLink>
          </ClientOnly>
        </nav>
      </div>
      <div class="flex items-center gap-4 mt-5">
        <input @change="submitInput" v-model.trim="input" class=" bg-white rounded-xl py-3 px-5 w-full" type="text"
          placeholder="Поиск товаров">
        <NuxtLink to="/cart">
          <img src="/cart.svg" alt="">
        </NuxtLink>
        <NuxtLink to="/favorites">
          <img src="/heart.svg" alt="">
        </NuxtLink>
      </div>
    </div>
  </header>
</template>