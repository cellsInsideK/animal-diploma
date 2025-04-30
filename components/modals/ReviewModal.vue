<script setup lang='ts'>
  import { toast } from 'vue-sonner';

  const isVisible = defineModel<boolean>('is-visible');
  const { productId } = defineProps<{ productId: number }>()
  const emit = defineEmits<{
    (e: 'created'): void
  }>();
  const userStore = useUserStore();
  const form = reactive({ rating: 5, description: '' });
  const loading = ref(false);

  const handleRegister = async () => {
    if (form.rating > 5 || form.rating <= 0 || form.description === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' })
    }

    loading.value = true;
    const res = await $fetch(`/api/reviews/${productId}`, {
      method: 'POST', body: {
        userId: userStore.user?.id,
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
      <Label for="email" class="mt-2 font-semibold">Оценка</Label>
      <Select v-model="form.rating">
        <SelectTrigger class="border-2 border-ui-primary w-full">
          <SelectValue placeholder="Поставьте оценку товару" />
        </SelectTrigger>
        <SelectContent class="border-2 border-ui-primary">
          <SelectGroup>
            <SelectItem :value="i" v-for="i in 5" :key="i">
              {{ i }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label for="desc" class="mt-2 font-semibold">Комментарий</Label>
      <textarea class="border-2 border-ui-primary rounded-md min-h-[100px] p-3" v-model="form.description" id="desc"
        placeholder="Напишите комментарий к своему отзыву"></textarea>
      <Button :disabled="loading" @click="handleRegister" class="bg-ui-primary w-full cursor-pointer">
        Оставить отзыв
      </Button>
    </DialogContent>
  </Dialog>
</template>