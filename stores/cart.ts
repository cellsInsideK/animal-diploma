import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { SelectProducts } from "~/server/database/schema";

export type CartItem = {amount: number} & SelectProducts; 

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Array<CartItem>>([]);

  const summaryPrice = computed(() => {
    return cart.value.reduce((sum, product) => sum += (product.amount * product.price), 0)
  })

  const addProduct = (item: SelectProducts) => {
    const hasInCart = cart.value.find(product => product.id === item.id)
    
    if (hasInCart) {
      return increaseItem(item.id);
    }
    
    const newItem = Object.assign({}, {amount: 1}, item);
    
    return cart.value.push(newItem)
  }
  
  const increaseItem = (id: number) => {
    const idx = cart.value.findIndex(item => item.id === id);

    if (cart.value[idx].amount === cart.value[idx].quantity)
      return;
    
    return cart.value[idx].amount += 1;
  }

  const decreaseItem = (id: number) => {
    const idx = cart.value.findIndex(item => item.id === id);
    
    if (cart.value[idx].quantity !== 1)
      return cart.value[idx].quantity -= 1;
  }

  const deleteItem = (id: number) => {
    const idx = cart.value.findIndex(item => item.id === id);

    return cart.value = cart.value.filter((_, index) => index !== idx);
  }

  const clearCart = () => {
    return cart.value = []
  }

  return { cart, summaryPrice, addProduct, increaseItem, decreaseItem, deleteItem, clearCart }
})