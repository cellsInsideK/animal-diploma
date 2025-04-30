<script setup lang="ts">
  const { productId } = defineProps<{ productId: number }>();
  const storage = useUserStore().favoriteStorage;
  const liked = ref(storage.includes(productId));

  watch(storage, (newVal) => {
    liked.value = newVal.includes(productId)
  })
</script>

<template>
  <svg v-if="!liked" class="hover:scale-125 transition-all duration-300" width="33.333344" height="30.583008"
    viewBox="0 0 33.3333 30.583" fill="none" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">

    <path id="Vector"
      d="M16.83 25.91L16.66 26.08L16.48 25.91C8.56 18.73 3.33 13.98 3.33 9.16C3.33 5.83 5.83 3.33 9.16 3.33C11.73 3.33 14.23 5 15.11 7.26L18.21 7.26C19.1 5 21.6 3.33 24.16 3.33C27.5 3.33 30 5.83 30 9.16C30 13.98 24.76 18.73 16.83 25.91ZM24.16 0C21.26 0 18.48 1.34 16.66 3.46C14.85 1.34 12.06 0 9.16 0C4.03 0 0 4.01 0 9.16C0 15.45 5.66 20.59 14.25 28.38L16.66 30.58L19.08 28.38C27.66 20.59 33.33 15.45 33.33 9.16C33.33 4.01 29.3 0 24.16 0Z"
      fill="#FA2F2F" fill-opacity="1.000000" fill-rule="nonzero" />
  </svg>
  <svg v-else class="hover:scale-125 transition-all duration-300" width="33.333328" height="30.583008"
    viewBox="0 0 33.3333 30.583" fill="none" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">

    <path id="Vector"
      d="M16.66 30.58L14.25 28.38C5.66 20.59 0 15.45 0 9.16C0 4.01 4.03 0 9.16 0C12.06 0 14.85 1.34 16.66 3.46C18.48 1.34 21.26 0 24.16 0C29.3 0 33.33 4.01 33.33 9.16C33.33 15.45 27.66 20.59 19.08 28.38L16.66 30.58Z"
      fill="#FA2F2F" fill-opacity="1.000000" fill-rule="nonzero" />
  </svg>
</template>