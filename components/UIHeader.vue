<script setup lang="ts">
  import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
</script>

<template>
  <header class="bg-ui-primary p-6">
    <div class="container mx-auto">
      <div class="flex gap-4 items-center justify-between">
        <img src="/logo.svg" class="" alt="">
        <img src="/burger.svg" class="block md:hidden" alt="">
        <nav class="hidden md:flex gap-12 text-base lg:text-lg">
          <NuxtLink class="text-white font-extrabold" to="/">Главная</NuxtLink>
          <NuxtLink class="text-white font-extrabold" to="/services">Услуги
          </NuxtLink>
          <NuxtLink class="text-white font-extrabold" to="/products">Товары
          </NuxtLink>

          <Popover>
            <PopoverTrigger class="cursor-pointer">
              <div class="flex gap-9">
                <p class="text-white font-extrabold">Вход</p>
                <img src="/arrow.svg" alt="">
              </div>
            </PopoverTrigger>
            <PopoverContent class="flex flex-col gap-4 w-fit p-4 font-extrabold">
              <button class=" cursor-pointer">Вход</button>
              <button class=" cursor-pointer">Регистрация</button>
            </PopoverContent>
          </Popover>

          <NuxtLink class="text-white font-extrabold" to="/delivery">Заказы
          </NuxtLink>
        </nav>
      </div>
      <div class="flex items-center gap-4 mt-5">
        <input class=" bg-white rounded-xl py-3 px-5 w-full" type="text" placeholder="Поиск товаров">
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