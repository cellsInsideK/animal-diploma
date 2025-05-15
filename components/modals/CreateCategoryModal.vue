<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { toast } from 'vue-sonner';
  import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

  import { Button } from '../ui/button';
  import { Input } from '../ui/input';
  import { Label } from '../ui/label';
  import type { SelectCategory } from '~/server/database/schema';

  const isOpen = defineModel<boolean>('isOpen');
  const emit = defineEmits<{
    (e: 'created'): void
  }>();

  const form = reactive<SelectCategory>({} as SelectCategory);

  const isFormLoading = ref(false);

  const handleSubmit = async () => {

    if (form.name.trim() === '') {
      return toast.error('Ошибка', { description: 'Название не может быть пустым полем' });
    }

    isFormLoading.value = true;
    const res = await $fetch(`/api/categories`, { method: 'POST', body: { name: form.name } });
    isFormLoading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    toast.success(res.message);
    emit('created')
    return isOpen.value = false;
  }
</script>

<template>
  <Dialog v-model:open="isOpen" class="p-5">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Создание категории</DialogTitle>
      </DialogHeader>

      <Label for="name">Назввание</Label>
      <Input class="border-2 border-ui-primary" v-model="form.name" id="name" type="text"
        placeholder="Введите название категории" />

      <DialogFooter>
        <Button @click="handleSubmit" :disabled="isFormLoading"
          class="w-full shadow-lg shadow-slate-400 bg-ui-primary cursor-pointer">Создать категорию</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>