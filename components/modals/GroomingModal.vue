<script setup lang='ts'>
  import { toast } from 'vue-sonner';

  const { items } = defineProps<{ items: string[] }>();
  const isVisible = defineModel<boolean>('is-visible');
  const emit = defineEmits<{
    (e: 'created'): void
  }>();
  const form = reactive({ name: '', tel: '', animalType: '', breed: '', age: '', comment: '' });
  const loading = ref(false);

  const handleSubmit = async () => {
    if (form.name.trim() === '' || form.tel.trim() === '' || form.animalType.trim() === '' || form.breed.trim() === '' || form.age.trim() === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' })
    }

    if (!validateTel(form.tel)) {
      return toast.error('Ошибка', { description: 'Укажите правильный номер телефона' })
    }

    loading.value = true;
    const res = await $fetch(`/api/grooming/`, {
      method: 'POST', body: {
        ...form, items: items.join('; ')
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
    <DialogContent class="max-h-[90%] overflow-y-auto">
      <h2 class="text-center font-bold text-2xl">Записаться на грумминг</h2>
      <p class="font-semibold">Выбранные вами услуги:</p>
      <p>{{ items.join('; ') }}</p>

      <Label for="name" class="font-semibold ">Имя (Обязательно)</Label>
      <Input v-model="form.name" class="border-2 border-ui-primary" placeholder="Имя" type="text" id="name" />

      <Label for="tel" class="font-semibold">Телефон (Обязательно)</Label>
      <Input v-model="form.tel" class="border-2 border-ui-primary" placeholder="+7 (___) ___-__-__" type="tel"
        id="tel" />

      <Label class="font-semibold">Вид животного (Обязательно)</Label>
      <Select v-model="form.animalType">
        <SelectTrigger class="border-2 border-ui-primary w-full">
          <SelectValue placeholder="Выберите вид животного" />
        </SelectTrigger>
        <SelectContent class="border-2 border-ui-primary">
          <SelectGroup>
            <SelectItem value="dog">
              Собака
            </SelectItem>
            <SelectItem value="cat">
              Кошка
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Label for="breed" class="font-semibold">Порода (Обязательно)</Label>
      <Input v-model="form.breed" class="border-2 border-ui-primary" placeholder="Корги" type="text" id="breed" />

      <Label for="age" class="font-semibold">Возраст (Обязательно)</Label>
      <Input v-model="form.age" class="border-2 border-ui-primary" placeholder="6 месяцев" type="text" id="age" />

      <Label for="desc" class="font-semibold">Комментарий</Label>
      <textarea class="border-2 border-ui-primary rounded-md min-h-[100px] p-3" v-model="form.comment" id="desc"
        placeholder="Напишите комментарий"></textarea>
      <Button :disabled="loading" @click="handleSubmit" class="bg-ui-primary w-full cursor-pointer">
        Оставить заявку
      </Button>
    </DialogContent>
  </Dialog>
</template>