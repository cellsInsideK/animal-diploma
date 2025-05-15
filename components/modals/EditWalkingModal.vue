<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { toast } from 'vue-sonner';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

  import { Button } from '../ui/button';
  import { type SelectWalking } from '~/server/database/schema';

  const { walking } = defineProps<{ walking: SelectWalking }>();
  const isOpen = defineModel<boolean>('isOpen');
  const emit = defineEmits<{
    (e: 'updated'): void
  }>();

  const form = reactive<SelectWalking>({} as SelectWalking);
  const isChanging = ref(false);
  const date = ref('');
  const time = ref('');
  const isFormLoading = ref(false);

  watch(() => walking, (newWalking) => {
    form.id = newWalking.id;
    form.status = newWalking.status;
  })


  const handleStatus = async (status: SelectWalking["status"]) => {
    isFormLoading.value = true;
    const res = await $fetch(`/api/walking/${walking.id}`, { method: 'PATCH', body: { status } });
    isFormLoading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    toast.success(res.message);
    emit('updated')
    return isOpen.value = false;
  }

  const showDateTime = async () => {
    isChanging.value = !isChanging.value;
  }

  const handleEditDateTime = async () => {
    if (date.value === '' || time.value === '') {
      return toast.error('Необходимо заполнить дату и время');
    }

    isFormLoading.value = true;
    const res = await $fetch(`/api/walking/${walking.id}`, { method: 'PATCH', body: { date: date.value, time: time.value } });
    isFormLoading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    isChanging.value = false;
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
      <div v-if="walking.type === 'walk'">
        <Button @click="showDateTime" :disabled="isFormLoading"
          class="w-full shadow-lg shadow-slate-400 bg-ui-primary cursor-pointer">Изменить дату и время</Button>
        <div v-if="isChanging" class="flex flex-col gap-4 w-full mt-4">
          <Label for="date" class="font-semibold">Дата (Обязательно)</Label>
          <Input v-model="date" class="border-2 border-ui-primary" placeholder="дд.мм.гггг" type="date" id="date" />

          <Label for="time" class="font-semibold mt-2 ">Время (Обязательно)</Label>
          <Input v-model="time" class="border-2 border-ui-primary" placeholder="10:00" type="time" id="time" />

          <Button @click="handleEditDateTime" :disabled="isFormLoading"
            class="w-full shadow-lg shadow-slate-400 bg-ui-primary cursor-pointer">Изменить</Button>
        </div>
      </div>

      <div v-if="walking.status === 'process'">
        <Button @click="handleStatus('accepted')" :disabled="isFormLoading"
          class="w-full shadow-lg shadow-slate-400 bg-ui-success cursor-pointer mt-4">Подтвердить запись</Button>
        <Button @click="handleStatus('canceled')" :disabled="isFormLoading"
          class="w-full shadow-lg shadow-slate-400 bg-ui-danger cursor-pointer mt-4">Отменить запись</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>