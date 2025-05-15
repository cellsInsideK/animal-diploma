<script setup lang='ts'>
  import { toast } from 'vue-sonner';

  const isVisible = defineModel<boolean>('is-visible');
  const emit = defineEmits<{
    (e: 'created'): void
  }>();
  const form = reactive({ type: 'walk', name: '', tel: '', animalType: '', date: '', time: '', comment: '' });
  const loading = ref(false);

  const handleSubmit = async () => {
    if (form.name.trim() === '' || form.tel.trim() === '' || form.animalType.trim() === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' })
    }

    if (!validateTel(form.tel)) {
      return toast.error('Ошибка', { description: 'Укажите правильный номер телефона' })
    }


    if (form.type === 'walk') {
      if (form.date === '' || form.time === '') {
        return toast.error('Необходимо указать дату и время');
      }

      if (!(['dog', 'cat'].includes(form.animalType.trim()))) {
        return toast.error('Укажите вид животного')
      }
    }

    loading.value = true;
    const res = await $fetch(`/api/walking/`, {
      method: 'POST', body: {
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
    <DialogContent class="max-h-[90%] overflow-y-auto">
      <h2 class="text-center font-bold text-2xl">Оставить заявку</h2>
      <Label for="email" class="font-semibold">Выберите услугу</Label>
      <Select v-model="form.type">
        <SelectTrigger class="border-2 border-ui-primary w-full">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent class="border-2 border-ui-primary">
          <SelectGroup>
            <SelectItem value="walk">
              Выгул
            </SelectItem>
            <SelectItem value="keep">
              Передержка
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p class="text-sm opacity-50">
        {{ form.type === 'walk' ? 'Мы подберем надежного и ответственного исполнителя для выгула вашего питомца.' :
          'Вы можете оставить питомца в нашем магазине или дома у надежного ситтера.'
        }}
      </p>
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
            <SelectItem v-if="form.type === 'keep'" value="Укажите вид животного">
              Другое
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div v-if="form.type === 'keep' && !(['dog', 'cat'].includes(form.animalType.trim()))">
        <Label for="animalType" class="font-semibold mb-2">Укажите вид животного</Label>
        <Input v-model="form.animalType" class="border-2 border-ui-primary" placeholder="Другое..." type="text"
          id="animalType" />
      </div>

      <div v-if="form.type === 'walk'">
        <Label for="date" class="font-semibold mb-2">Дата (Обязательно)</Label>
        <Input v-model="form.date" class="border-2 border-ui-primary ьи" placeholder="дд.мм.гггг" type="date"
          id="date" />

        <Label for="time" class="font-semibold mt-2 mb-2">Время (Обязательно)</Label>
        <Input v-model="form.time" class="border-2 border-ui-primary" placeholder="10:00" type="time" id="time" />
      </div>

      <Label for="desc" class="font-semibold">Комментарий</Label>
      <textarea class="border-2 border-ui-primary rounded-md min-h-[100px] p-3" v-model="form.comment" id="desc"
        placeholder="Напишите комментарий"></textarea>
      <Button :disabled="loading" @click="handleSubmit" class="bg-ui-primary w-full cursor-pointer">
        Оставить заявку
      </Button>
    </DialogContent>
  </Dialog>
</template>