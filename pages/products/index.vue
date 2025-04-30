<script setup>
  const items = ref([]);
  const isLoading = ref(true);
  const route = useRoute()
  const params = ref(route.query);

  watch(() => route.query, (newValue) => {
    params.value = newValue
  })

  watch(() => params.value, async () => {
    await getData();
  }, { deep: true })

  onMounted(async () => {
    await getData();
  })

  const getData = async () => {
    isLoading.value = true;
    const res = await $fetch(`/api/products/find?sort=${params.value.sort}&type=${params.value?.type?.trim()}&name=${params.value?.name?.trim()}`);
    items.value = res.data;
    isLoading.value = false;
  }

  useHead({ title: 'Ассортимент' })
</script>

<template>
  <UiLoader :is-loading="isLoading">
    <UISection>
      <h2 class="font-extrabold text-ui-primary text-2xl">Товары</h2>
      <div class="flex justify-between md:justify-end my-5">
        <Select v-model:model-value="params.sort">
          <SelectTrigger class="border-2 border-ui-primary p-6">
            <SelectValue />
          </SelectTrigger>
          <SelectContent class="border-2 border-ui-primary">
            <SelectGroup>
              <SelectItem value="new">
                Новые
              </SelectItem>
              <SelectItem value="old">
                Старые
              </SelectItem>
              <SelectItem value="cheap">
                Сначала дешевле
              </SelectItem>
              <SelectItem value="expensive">
                Сначала дороже
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <template class="block md:hidden">
          <Select v-model:model-value="params.type">
            <SelectTrigger class="border-2 border-ui-primary p-6">
              <SelectValue placeholder="Категория товара" />
            </SelectTrigger>
            <SelectContent class="border-2 border-ui-primary">
              <SelectGroup>
                <SelectItem value=" ">
                  Всё
                </SelectItem>
                <SelectItem value="dog">
                  Для собак
                </SelectItem>
                <SelectItem value="cat">
                  Для кошек
                </SelectItem>
                <SelectItem value="rat">
                  Для грызунов
                </SelectItem>
                <SelectItem value="toy">
                  Игрушки и аксессуары
                </SelectItem>
                <SelectItem value="medicine">
                  Зооаптека
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </template>
      </div>
      <div class="flex gap-4">
        <aside class="min-w-[200px] hidden md:block">
          <ul class="flex flex-col gap-4 cursor-pointer">
            <li @click="params.type = ''">Всё</li>
            <li @click="params.type = 'dog'">Для собак</li>
            <li @click="params.type = 'cat'">Для кошек</li>
            <li @click="params.type = 'rat'">Для грызунов</li>
            <li @click="params.type = 'toy'">Игрушки и аксессуары</li>
            <li @click="params.type = 'medicine'">Зооаптека</li>
          </ul>
        </aside>
        <div class="flex gap-12 flex-wrap justify-center w-full">
          <template v-if="items?.length > 0">
            <template v-for="item in items">
              <UIProductCard :item="item" />
            </template>
          </template>
          <template v-else>Такого товара нет в ассортименте</template>
        </div>
      </div>
    </UISection>
  </UiLoader>
</template>