import { defineStore } from 'pinia'
import { computed, ref } from "vue";
import type { SelectUsers } from '~/server/database/schema';

export const useUserStore = defineStore('user', () => {
  const user = ref<SelectUsers | undefined>(undefined);
  const isAuthenticated = computed(() => user.value !== undefined);

  const logout = async () => {
    const res = await $fetch('/api/logout');

    if (res.statusCode === 200)
      return user.value = undefined;
  }

  const login = async (email: string, password: string) => {
    const res = await $fetch('/api/login', {method: 'POST', body: {email, password}})

    if (res.statusCode !== 200) {
      return res;
    }

    user.value = res.user
    return res;
  }

  return { user, isAuthenticated, logout, login }
})