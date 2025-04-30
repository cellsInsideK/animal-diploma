<script setup lang="ts">
  import { toast } from 'vue-sonner';
  import CartModal from '~/components/modals/CartModal.vue';
  import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '~/components/ui/number-field';

  const isVisible = ref(false);
  const cart = useCartStore();
  const userStore = useUserStore();
  const router = useRouter()
  definePageMeta({ middleware: 'auth' })

  const handleCreated = () => {
    cart.clearCart();
    return router.push('/');
  }

  const addToFavorite = async (item: any) => {
    const idx = userStore.favoriteStorage.findIndex(i => i === item.id)

    if (idx !== -1) {
      const res = await $fetch('/api/favorites', { method: 'DELETE', body: { userId: userStore.user?.id, productId: item.id } });
      if (res.statusCode !== 200) {
        return toast.error('Ошибка', { description: res.message });
      }

      return userStore.favoriteStorage.splice(idx, 1);
    }

    const res = await $fetch('/api/favorites', { method: 'POST', body: { userId: userStore.user?.id, productId: item.id } });
    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    return userStore.favoriteStorage.push(item.id);
  }
</script>

<template>
  <CartModal v-model:is-visible="isVisible" @created="handleCreated" />
  <UISection v-if="cart.cart.length > 0">
    <div class="flex gap-4 items-center">
      <h2 class="font-bold text-ui-primary text-base md:text-lg my-5">Корзина</h2>
      <Button @click="cart.clearCart" class="bg-ui-primary py-6 px-8 cursor-pointer">Очистить корзину</Button>
    </div>
    <div class="flex flex-col md:flex-row justify-between gap-12">
      <div class="flex flex-col gap-7 w-full">
        <template v-for="item in cart.cart" :key="item.id">
          <div class="border-2 border-ui-primary rounded-md p-7 flex gap-5">
            <!-- @vue-ignore -->
            <img :src="getImageUrl(item.productImages.at(-1).image)" class="w-[100px] h-[100px] object-contain" alt="">
            <div class="flex flex-col w-full h-full gap-4">
              <h2 class="font-medium text-base md:text-lg">{{ item.name }}</h2>
              <p class="font-bold text-lg text-right">{{ item.amount * item.price }} ₽</p>
              <div class="flex justify-end">
                <NumberField v-model="item.amount" :min="1" :max="item.quantity" class="w-fit ">
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </div>
              <div class="flex justify-end h-full items-end gap-7">
                <UIHeart @click="addToFavorite(item)" :product-id="item.id" class="size-6 cursor-pointer" />
                <div @click="cart.deleteItem(item.id)" class="flex mt-auto gap-4 cursor-pointer">
                  <p class="font-medium text-base">Удалить</p>
                  <img src="/delete.svg" color="black" alt="">
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="border-2 border-ui-primary rounded-md h-fit w-full md:w-fit p-7 ">
        <div class="flex justify-between">
          <p class="font-bold text-lg">Итого</p>
          <p class="font-bold text-lg">{{ cart.summaryPrice }} ₽</p>
        </div>
        <p class="mt-4 font-bold text-lg opacity-50 md:min-w-[300px]">Без учета стоимости доставки</p>
        <div class="flex justify-center">
          <Button @click="isVisible = true" class="mt-4 bg-ui-primary py-6 px-8 cursor-pointer w-full md:w-fit">Оформить
            заказ</Button>
        </div>
      </div>
    </div>
  </UISection>
  <UISection v-else>
    <p class="text-center text-lg">
      Добавьте товар в корзину и порадуйте вашего питомца!
    </p>
  </UISection>
</template>