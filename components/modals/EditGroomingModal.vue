<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { toast } from 'vue-sonner';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

  import { Button } from '../ui/button';
  import { type SelectGrooming } from '~/server/database/schema';

  const { grooming } = defineProps<{ grooming: SelectGrooming }>();
  const isOpen = defineModel<boolean>('isOpen');
  const emit = defineEmits<{
    (e: 'updated'): void
  }>();

  const form = reactive<SelectGrooming>({} as SelectGrooming);
  const isChanging = ref(false);
  const date = ref('');
  const time = ref('');
  const isFormLoading = ref(false);

  watch(() => grooming, (newGroomin) => {
    form.id = newGroomin.id;
    form.status = newGroomin.status;
  })


  const handleStatus = async (status: SelectGrooming["status"]) => {
    isFormLoading.value = true;
    const res = await $fetch(`/api/grooming/${grooming.id}`, { method: 'PATCH', body: { status } });
    isFormLoading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    toast.success(res.message);
    emit('updated')
    return isOpen.value = false;
  }
</script>

<template>
  <Dialog v-model:open="isOpen" class="p-5">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Редактировать запись</DialogTitle>
      </DialogHeader>

      <div v-if="grooming.status === 'process'">
        <Button @click="handleStatus('accepted')" :disabled="isFormLoading"
          class="w-full shadow-lg shadow-slate-400 bg-ui-success cursor-pointer mt-4">Подтвердить запись</Button>
        <Button @click="handleStatus('canceled')" :disabled="isFormLoading"
          class="w-full shadow-lg shadow-slate-400 bg-ui-danger cursor-pointer mt-4">Отменить запись</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>