<script setup>
  useHead({
    title: 'Услуги'
  })
</script>

<template>
  <UISection>
    <div class="flex flex-col gap-8">
      <div class="flex flex-col md:flex-row gap-3 md:gap-24 bg-ui-primary rounded-xl p-9 md:p-12">
        <img src="/service-scissors.svg" class="size-24 max-w-[250px] max-h-[250px] md:size-full self-center" alt="">
        <div class="flex flex-col gap-3 md:gap-6 text-white w-full">
          <h2 class="text-lg md:text-4xl font-extrabold text-center md:text-left">Грумминг</h2>
          <p class="font-medium text-md md:text-2xl">Профессиональный уход за шерстью и когтями - это гарантия
            великолепного
            внешнего вида
            вашего питомца</p>
          <NuxtLink
            class="text-ui-primary bg-white rounded-md py-3 text-center font-medium text-xs mt-6 md:max-w-[250px] md:text-lg"
            to="https://puffy-groom.com/" target="_blank">
            Подробнее
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-3 md:gap-24 bg-ui-primary rounded-xl p-9 md:p-12">
        <img src="/service-dog.svg" class="size-24 max-w-[250px] max-h-[250px] md:size-full self-center" alt="">
        <div class="flex flex-col gap-3 md:gap-6 text-white w-full">
          <h2 class="text-lg md:text-4xl font-extrabold text-center md:text-left">Выгул и передержка</h2>
          <p class="font-medium text-md md:text-2xl">
            Тщательный отбор исполнителей, ответственность за выгульщиков, нянь и ситтеров
          </p>
          <NuxtLink
            class="text-ui-primary bg-white rounded-md py-3 text-center font-medium text-xs mt-6 md:max-w-[250px] md:text-lg"
            to="https://www.walkwag.ru/" target="_blank">
            Подробнее
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-3 md:gap-24 bg-ui-primary rounded-xl p-9 md:p-12">
        <img src="/service-house.svg" class="size-24 max-w-[250px] max-h-[250px] md:size-full self-center" alt="">
        <div class="flex flex-col gap-3 md:gap-6 text-white w-full">
          <h2 class="text-lg md:text-4xl font-extrabold text-center md:text-left">Пристройство</h2>
          <p class="font-medium text-md md:text-2xl">
            Проверенные приюты, с которыми мы работаем. Выберите питомца и оставьте хаявку
          </p>
          <NuxtLink
            class="text-ui-primary bg-white rounded-md py-3 text-center font-medium text-xs mt-6 md:max-w-[250px] md:text-lg"
            to="/adoption">
            Подробнее
          </NuxtLink>
        </div>
      </div>
    </div>
  </UISection>
</template>