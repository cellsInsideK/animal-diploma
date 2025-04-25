<script setup lang="ts">
  import { toast } from 'vue-sonner';

  const open = defineModel<boolean>('isVisible');
  const props = defineProps<{ id: string }>();
  const form = ref({ name: '', tel: '', agree: false });

  const handleSubmit = async () => {
    if (form.value.name.trim() === '' || form.value.tel.trim() === '' || form.value.agree === false) {
      return toast.error('Необходимо заполнить все поля')
    }

    const res = await $fetch('/api/adoption-request', {
      method: 'POST', body: {
        name: form.value.name,
        tel: form.value.tel,
        animalId: props.id
      }
    });

    if (res.statusCode !== 200) {
      return toast.error('Ошибка отправки заявки')
    }

    toast.success('Заявка создана');
    open.value = false;
  }
</script>

<template>
  <Dialog v-model:open="open" v-if="open">
    <DialogContent>
      <h2 class="text-center font-bold text-xl">Забрать питомца</h2>
      <Label for="name">Имя (обязательно)</Label>
      <Input v-model="form.name" id="name" type="text" placeholder="Имя"
        class="rounded-md border-2 border-ui-primary" />
      <Label for="tel">Телефон (обязательно)</Label>
      <Input v-model="form.tel" id="tel" type="text" placeholder="+7 (___) ___-__-__"
        class="rounded-md border-2 border-ui-primary" />
      <Label for="agree" class="flex gap-2">
        <input v-model="form.agree" id="agree" type="checkbox" class="w-[75px] rounded-md border-2 border-ui-primary" />
        Я ознакомлена(а) и соглашаюсь с условиями пользовательского соглашения.Я даю согласие на обработку персональных
        данных.
      </Label>
      <Button @click="handleSubmit" class="bg-ui-primary cursor-pointer">Оставить заявку</Button>
    </DialogContent>
  </Dialog>
</template>