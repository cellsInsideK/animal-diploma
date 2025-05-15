<script setup>
  const items = ref([]);
  const sorts = ref([]);
  const page = ref(1);
  const total = ref(0);
  const isLoading = ref(true);
  const route = useRoute()
  const params = ref(route.query);

  const hasMore = computed(() => {
    return page.value * 8 < total.value;
  })

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
    const [res1, res2] = await Promise.all([
      await $fetch(`/api/products/find?sort=${params.value.sort}&page=${page}&type=${params.value?.type?.trim()}&name=${params.value?.name?.trim()}`),
      await $fetch('/api/categories')
    ])
    items.value = res1.data;
    total.value = res1.all;
    sorts.value = res2.data;
    isLoading.value = false;
  }

  const getNext = async () => {
    isLoading.value = true;
    page.value += 1;
    const res = await $fetch(`/api/products/find?sort=${params.value.sort}&page=${page.value}&type=${params.value?.type?.trim()}&name=${params.value?.name?.trim()}`);
    isLoading.value = false;
    items.value.push(...res.data);
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
                <SelectItem v-for="item in sorts" :value="item.id" :key="item.id">
                  {{ item.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </template>
      </div>
      <div class="flex gap-4">
        <aside class="min-w-[200px] hidden md:block">
          <ul class="flex flex-col gap-4 cursor-pointer">
            <li :class="params.type.trim() === '' ? 'font-bold text-ui-primary' : ''" @click="params.type = ''">Всё</li>
            <template v-for="item in sorts">
              <li :class="params.type === item.id ? 'font-bold text-ui-primary' : ''" @click="params.type = item.id">
                {{ item.name }}
              </li>
            </template>
          </ul>
        </aside>
        <div class="w-full">
          <div class="flex gap-12 flex-wrap justify-center w-full">
            <template v-if="items?.length > 0">
              <template v-for="item in items">
                <UIProductCard :item="item" />
              </template>
            </template>
            <template v-else>
              <p class="flex justify-center items-center w-full ">Такого товара нет в ассортименте</p>
            </template>
          </div>
          <Button v-if="hasMore && items.length > 0" @click="getNext"
            class="flex mt-4 mx-auto px-10 py-7 bg-ui-primary cursor-pointer">
            Найти еще
          </Button>
        </div>
      </div>
    </UISection>
  </UiLoader>
</template>