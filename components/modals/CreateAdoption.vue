<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { Dialog, DialogContent, DialogFooter } from '../ui/dialog';

  import { toast } from 'vue-sonner';
  import { Button } from '../ui/button';
  import { Input } from '../ui/input';
  import { Label } from '../ui/label';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
  import type { SelectAdoption, } from '~/server/database/schema';
  import { createImageHash, useSupabaseClient } from '#imports';

  const emit = defineEmits<{
    (e: 'created'): void
  }>();
  const isOpen = defineModel<boolean>('isOpen');

  const isFormLoading = ref(false);
  const form = reactive<SelectAdoption>({ name: '', image: '', type: 'dog', description: '', age: '', sex: '' } as SelectAdoption);
  const supabase = useSupabaseClient();

  const handleSubmit = async () => {
    if (form.name === '' || form.image === '' || form.description === '' || form.age === '' || form.sex === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' });
    }

    isFormLoading.value = true;
    const res = await $fetch('/api/adoption', { method: 'POST', body: form });
    isFormLoading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    toast.success(res.message);
    emit('created')
    return isOpen.value = false;
  }

  const handleUploadImage = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const fileName = createImageHash(1000, 9999, file.name);
    const { data, error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) return toast.error('Ошибка', { description: 'Не удалось загрузить изображение' });

    form.image = fileName;

    return toast.success('Изображение загружено');
  }
</script>

<template>
  <Dialog v-model:open="isOpen" class="p-5">
    <DialogContent>
      <h2 class="items-center font-extrabold text-xl">
        Добавление питомца
      </h2>

      <Label for="name">Кличка</Label>
      <Input v-model="form.name" id="name" type="text" class="border-2 border-ui-primary"
        placeholder="Введите кличку питомца" />
      <Label>Тип</Label>
      <Select v-model="form.type">
        <SelectTrigger class="border-2 border-ui-primary w-full">
          <SelectValue placeholder="Выберите тип питомца" />
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
      <Label>Пол</Label>
      <Select v-model="form.sex">
        <SelectTrigger class="border-2 border-ui-primary w-full">
          <SelectValue placeholder="Выберите пол питомца" />
        </SelectTrigger>
        <SelectContent class="border-2 border-ui-primary">
          <SelectGroup>
            <SelectItem value="male">
              Мальчик
            </SelectItem>
            <SelectItem value="female">
              Девочка
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label for="age">Возраст</Label>
      <Input v-model="form.age" id="age" type="text" class="border-2 border-ui-primary"
        placeholder="Введите возраст питомца" />
      <Label for="image">Изображение</Label>
      <input @change="handleUploadImage"
        class="flex h-10 w-full rounded-md border-2 border-ui-primary bg-background px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium"
        id="image" type="file" accept="image/*" />

      <Label for="description">Описание</Label>
      <textarea v-model="form.description" id="description" class="border-2 border-ui-primary p-2 rounded-md resize-y"
        placeholder="Введите описание питомца"></textarea>

      <DialogFooter>
        <Button @click="handleSubmit" :disabled="isFormLoading" class="w-full bg-ui-primary">Добавить
          питомца</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
