<script setup>
  useHead({
    title: 'Тузик | Магазин для вашего питомца!'
  })
</script>

<template>
  <section
    class="container relative mx-auto flex justify-between items-center min-h-[420px] overflow-hidden max-h-[500px] w-full pl-3">
    <div class="flex flex-col justify-center ">
      <h1 class="font-extrabold text-3xl md:text-4xl text-ui-primary max-w-[475px] leading-16">
        Лучшая
        продукция для
        лучших друзей!
      </h1>
      <div class="flex flex-wrap gap-5 mt-6">
        <NuxtLink to="/services"
          class="text-md font-bold py-3 px-10 md:py-5 md:px-17 border-3 border-ui-primary rounded-xl text-ui-primary">
          Наши услуги
        </NuxtLink>
        <NuxtLink to="/products"
          class="text-md text-white font-bold py-3 px-10 md:py-5 md:px-17 border-3 border-ui-primary rounded-xl bg-ui-primary">
          Наши товары
        </NuxtLink>
      </div>
    </div>
    <img src="/hero.png"
      class=" max-w-fit overflow-hidden absolute -inset-10 opacity-40 lg:opacity-100 -z-1 h-fit w-fit lg:block lg:static"
      alt="">
  </section>
  <section class="container mx-auto my-8 pl-3">
    <h2 class="font-extrabold text-2xl text-ui-primary opacity-80 mb-9">Новинки в продаже</h2>
    <div class="flex flex-nowrap flex-row gap-8 overflow-hidden">
      <div class="border-3 border-ui-primary py-8 px-5 rounded-xl max-w-[350px] shrink-0">
        <div class="flex gap-3 items-center">
          <img src="/product.png" alt="" class="h-full">
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-ui-primary text-3xl">200 ₽</p>
            <h3 class="font-medium text-sm">
              Сухой корм DELICANA
              Premium, индейка с
              овощами, 400 гр.
            </h3>
            <div class="flex gap-1.5">
              <img src="/star.svg" alt="" v-for="i in 5">
            </div>
            <button class="rounded-lg bg-ui-primary py-2 px-6 w-fit text-white mt-2">Купить</button>
          </div>
        </div>
      </div>
      <div class="border-3 border-ui-primary py-8 px-5 rounded-xl max-w-[350px] shrink-0">
        <div class="flex gap-3 items-center">
          <img src="/product.png" alt="" class="h-full">
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-ui-primary text-3xl">200 ₽</p>
            <h3 class="font-medium text-sm">
              Сухой корм DELICANA
              Premium, индейка с
              овощами, 400 гр.
            </h3>
            <div class="flex gap-1.5">
              <img src="/star.svg" alt="" v-for="i in 5">
            </div>
            <button class="rounded-lg bg-ui-primary py-2 px-6 w-fit text-white mt-2">Купить</button>
          </div>
        </div>
      </div>
      <div class="border-3 border-ui-primary py-8 px-5 rounded-xl max-w-[350px] shrink-0">
        <div class="flex gap-3 items-center">
          <img src="/product.png" alt="" class="h-full">
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-ui-primary text-3xl">200 ₽</p>
            <h3 class="font-medium text-sm">
              Сухой корм DELICANA
              Premium, индейка с
              овощами, 400 гр.
            </h3>
            <div class="flex gap-1.5">
              <img src="/star.svg" alt="" v-for="i in 5">
            </div>
            <button class="rounded-lg bg-ui-primary py-2 px-6 w-fit text-white mt-2">Купить</button>
          </div>
        </div>
      </div>
      <div class="border-3 border-ui-primary py-8 px-5 rounded-xl max-w-[350px] shrink-0">
        <div class="flex gap-3 items-center">
          <img src="/product.png" alt="" class="h-full">
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-ui-primary text-3xl">200 ₽</p>
            <h3 class="font-medium text-sm">
              Сухой корм DELICANA
              Premium, индейка с
              овощами, 400 гр.
            </h3>
            <div class="flex gap-1.5">
              <img src="/star.svg" alt="" v-for="i in 5">
            </div>
            <button class="rounded-lg bg-ui-primary py-2 px-6 w-fit text-white mt-2">Купить</button>
          </div>
        </div>
      </div>
      <div class="border-3 border-ui-primary py-8 px-5 rounded-xl max-w-[350px] shrink-0">
        <div class="flex gap-3 items-center">
          <img src="/product.png" alt="" class="h-full">
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-ui-primary text-3xl">200 ₽</p>
            <h3 class="font-medium text-sm">
              Сухой корм DELICANA
              Premium, индейка с
              овощами, 400 гр.
            </h3>
            <div class="flex gap-1.5">
              <img src="/star.svg" alt="" v-for="i in 5">
            </div>
            <button class="rounded-lg bg-ui-primary py-2 px-6 w-fit text-white mt-2">Купить</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="container mx-auto my-8 pl-3">
    <h2 class="font-extrabold text-2xl text-ui-primary opacity-80 mb-9">Популярные категории</h2>
    <div class="flex flex-wrap md:flex-nowrap gap-5 items-center justify-center ">
      <div class="grid place-items-center bg-ui-primary rounded-xl w-full max-w-xs aspect-square">
        <img src="/dog.svg" alt="">
      </div>
      <div class="grid place-items-center bg-ui-primary rounded-xl w-full max-w-xs aspect-square">
        <img src="/cat.svg" alt="">
      </div>
      <div class="grid place-items-center bg-ui-primary rounded-xl w-full max-w-xs aspect-square">
        <img src="/hamster.svg" alt="">
      </div>
    </div>
  </section>
</template>