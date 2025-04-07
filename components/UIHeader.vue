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
          <!-- TODO: поменять на селект -->
          <NuxtLink class="text-white font-extrabold" to="">Вход</NuxtLink>
          <NuxtLink class="text-white font-extrabold" to="/delivery">Заказы
          </NuxtLink>
        </nav>
      </div>
      <div class="flex items-center gap-4 mt-5">
        <input class=" bg-white rounded-xl py-3 px-5 w-full" type="text" placeholder="Поиск товаров">
        <!-- TODO: replace to link -->
        <img src="/cart.svg" alt="">
        <img src="/heart.svg" alt="">
      </div>
    </div>
  </header>
</template>