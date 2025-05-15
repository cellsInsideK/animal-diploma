<script setup>
  import { toast } from 'vue-sonner';
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

  const { item, admin } = defineProps({
    item: Object,
    admin: Boolean
  });

  const emit = defineEmits(['updated']);

  const handleDelete = async () => {
    const res = await $fetch(`/api/orders/${item.order.id}`, {
      method: 'DELETE'
    })

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }
    emit('updated')
  }

  const handleRepeat = async () => {
    const itemsArr = [];
    let canRepeat = true;

    item.items.forEach((val) => {
      if (val.product.details.quantity < val.order_item.quantity) {
        canRepeat = false
      }
      itemsArr.push({ id: val.order_item.product_id, amount: val.order_item.quantity })
    })

    if (!canRepeat) {
      return toast.error('Ошибка', { description: 'Один из товаров отсутствует' })
    }

    const res = await $fetch(`/api/orders`, {
      method: 'POST',
      body: {
        userId: item.order.userId,
        items: itemsArr,
        address: item.order.address,
        tel: item.order.tel,
        name: item.order.name
      }
    })

    if (res.statusCode !== 200) {
      toast.error('Ошибка', { description: res.message })
      return isVisible.value = false;
    }

    toast.success(res.message);
    emit('updated');
  }

  const handleCancel = async () => {
    const res = await $fetch(`/api/orders/${item.order.id}`, {
      method: 'PATCH',
      body: { status: 'canceled' }
    })

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }
    emit('updated')
  }

  const handleAccept = async () => {
    const res = await $fetch(`/api/orders/${item.order.id}`, {
      method: 'PATCH',
      body: { status: 'accepted' }
    })

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }
    emit('updated')
  }

  const getOrderPrice = (item) => {
    let sum = 0;

    item.items.forEach(item => {
      return sum += item.product.details.price * item.order_item.quantity
    })

    return sum;
  }

  const statusEnum = {
    'process': 'Новый',
    'canceled': 'Отмененный',
    'accepted': 'Подтвержденный'
  }
</script>

<template>
  <Accordion class="border-2 border-ui-primary flex flex-col w-full rounded-lg overflow-hidden" collapsible
    :default-value="item.order.id">
    <AccordionItem :value="item.order.id">
      <AccordionTrigger
        class="bg-ui-primary rounded-b-none items-center text-white cursor-pointer p-5 font-bold md:text-lg no-underline!">
        {{ `Заказ №${item.order.id}` }}
        <div class="flex gap-2 items-center ml-auto">
          <img @click.stop="handleDelete" v-if="admin" class="size-6 cursor-pointer" src="/delete2.svg" alt="">
          <img @click.stop="handleRepeat" v-else-if="item.order.status !== 'process'" class="size-5 cursor-pointer"
            src="/repeat.svg" alt="">
        </div>
      </AccordionTrigger>
      <AccordionContent class="flex flex-col gap-5 p-5">
        <p class="font-bold md:text-lg">Статус: {{ statusEnum[item.order.status] }}</p>
        <p v-if="admin" class="font-bold md:text-lg">Заказчик: {{ item.order.name }}</p>
        <p class="font-bold md:text-lg">Оформлен: {{ Intl.DateTimeFormat('ru', { dateStyle: 'short' }).format(new
          Date(item.order.createdAt))
        }}</p>
        <p class="font-bold md:text-lg">Состав заказа:</p>
        <div class="flex flex-col gap-3">
          <template v-for="item in item.items">
            <div class="flex flex-col gap-2 md:flex-row md:justify-between md:items-center w-full">
              <img :src="getImageUrl(item.product.images.at(-1).image)" class="size-[150px] object-contain" alt="">
              <p class="max-w-[300px]">{{ item.product.details.name }}</p>
              <p>{{ item.order_item.quantity }} шт.</p>
              <p>{{ item.product.details.price }} ₽</p>
              <p>{{ item.product.details.price * item.order_item.quantity }} ₽</p>
            </div>
          </template>
        </div>
        <p class="font-bold md:text-lg text-right">Сумма заказа: {{ item.address !== '' ? `${getOrderPrice(item) + 350}
          ₽ (+350 доставка)`
          : `${getOrderPrice(item)} ₽` }}</p>
        <div v-if="item.order.status === 'process'" class="flex gap-3 w-full justify-end">
          <Button @click="handleAccept" v-if="admin" class="bg-ui-success cursor-pointer py-5 px-8">Подтвердить</Button>
          <Button @click="handleCancel" class="bg-ui-danger cursor-pointer py-5 px-8">Отменить</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>