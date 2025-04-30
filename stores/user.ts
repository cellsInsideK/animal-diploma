import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia'
import { computed, ref } from "vue";
import type { SelectUsers } from '~/server/database/schema';

export const useUserStore = defineStore('user', () => {
  const user = ref<SelectUsers | undefined>(undefined);
  const isAuthenticated = computed(() => user.value !== undefined);
  const favorites = ref<number[]>([]);
  const favoriteStorage = useLocalStorage<number[]>('favorite', favorites)
  favoriteStorage.value = [];

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

  const session = async () => {
    const res = await $fetch('/api/session');
    user.value = res?.user as SelectUsers;
    favorites.value = res?.favorites ?? [];
  }

  return { user, isAuthenticated, favoriteStorage, logout, login, session }
})