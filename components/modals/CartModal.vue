<script setup lang='ts'>
  import { toast } from 'vue-sonner';

  const isVisible = defineModel<boolean>('is-visible');
  const emit = defineEmits<{
    (e: 'created'): void
  }>();
  const userStore = useUserStore();
  const cart = useCartStore();
  const form = reactive({ name: '', tel: '', type: 'delivery', address: '' });
  const loading = ref(false);

  const handleSubmit = async () => {
    if (form.name === '' || form.tel === '' || form.type === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' })
    }

    if (form.type === 'delivery' && form.address === '') {
      return toast.error('Ошибка', { description: 'Необходимо указать адрес для доставки' })
    }

    if (form.type === 'delivery') {
      form.address = '';
    }

    loading.value = true;
    const res = await $fetch(`/api/orders`, {
      method: 'POST',
      body: {
        userId: userStore.user?.id,
        items: cart.cart,
        ...form
      }
    })
    loading.value = false;

    if (res.statusCode !== 200) {
      toast.error('Ошибка', { description: res.message })
      return isVisible.value = false;
    }

    emit('created');
    toast.success(res.message);
    return isVisible.value = false;
  }
</script>

<template>
  <Dialog v-if="isVisible" v-model:open="isVisible">
    <DialogContent>
      <h2 class="text-center font-bold text-2xl">Оставить отзыв</h2>
      <Label for="name" class="mt-2 font-semibold">Имя</Label>
      <Input v-model="form.name" id="name" type="text" class="border-2 border-ui-primary" placeholder="Введите имя" />
      <Label for="tel" class="mt-2 font-semibold">Телефон</Label>
      <Input v-model="form.tel" id="tel" type="text" class="border-2 border-ui-primary"
        placeholder="+7 (___) ___-__-__" />
      <Label for="tel" class="mt-2 font-semibold">Тип доставки:</Label>
      <Select v-model="form.type">
        <SelectTrigger class="border-2 border-ui-primary w-full">
          <SelectValue placeholder="Тип доставки:" />
        </SelectTrigger>
        <SelectContent class="border-2 border-ui-primary">
          <SelectGroup>
            <SelectItem value="delivery">
              Доставка (+350 руб)
            </SelectItem>
            <SelectItem value="pickup">
              Самовывоз
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label for="address" class="mt-2 font-semibold">{{ form.type === 'pickup' ? 'Самовывоз осуществляется по адресу:'
        :
        'Напишите адрес доставки' }}</Label>
      <Input v-if="form.type !== 'pickup'" v-model="form.address" id="address" type="text"
        class="border-2 border-ui-primary" placeholder="Адрес" />
      <p v-if="form.type === 'pickup'">г. Москва, ул. Московская, д 25, стр 1</p>
      <div class="flex justify-between items-center">
        <p class="font-bold text-lg">Итого:</p>
        <p class="font-bold text-lg">{{ form.type !== 'pickup' ? cart.summaryPrice + 350 : cart.summaryPrice }} ₽</p>
      </div>
      <Button :disabled="loading" @click="handleSubmit" class="bg-ui-primary w-full cursor-pointer">
        Оформить заказ
      </Button>
    </DialogContent>
  </Dialog>
</template>