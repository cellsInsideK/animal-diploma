<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { Dialog, DialogContent, DialogFooter } from '../ui/dialog';

  import { toast } from 'vue-sonner';
  import { Button } from '../ui/button';
  import { Input } from '../ui/input';
  import { Label } from '../ui/label';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
  import type { SelectProducts } from '~/server/database/schema';
  import { createImageHash, useSupabaseClient } from '#imports';

  type Body = { images: [] } & SelectProducts
  const formFactory = () => { return { name: '', price: 200, type: 'cat', quantity: 20, description: '', images: [] } }

  const emit = defineEmits<{
    (e: 'created'): void
  }>();
  const isOpen = defineModel<boolean>('isOpen');

  const isFormLoading = ref(false);
  const form = ref<Body>(formFactory() as Body);
  const supabase = useSupabaseClient();

  const handleSubmit = async () => {
    if (form.value.name === '' || form.value.price <= 0 || form.value.description === '' || form.value.description === '' || form.value.quantity <= 0 || form.value.images.length === 0) {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' });
    }

    isFormLoading.value = true;
    const res = await $fetch('/api/products', { method: 'POST', body: { ...form.value } });
    isFormLoading.value = false;

    if (res.statusCode !== 200) {
      return toast.error('Ошибка', { description: res.message });
    }

    form.value = formFactory() as Body;

    toast.success(res.message);
    emit('created')
    return isOpen.value = false;
  }

  const handleUploadImage = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;

    isFormLoading.value = true;

    for (let i = 0; i < files.length; i++) {
      if (i >= 3) {
        break;
      }

      const fileName = createImageHash(1000, 9999, files[i].name);
      const { data, error } = await supabase.storage.from('images').upload(fileName, files[i]);

      form.value.images.push(fileName as never);

      if (error) {
        toast.error('Ошибка', { description: 'Не удалось загрузить изображения' });
        break;
      }
    }

    isFormLoading.value = false;

    return toast.success('Изображения загружены');
  }
</script>

<template>
  <Dialog v-model:open="isOpen" class="p-5">
    <DialogContent>
      <h2 class="items-center font-extrabold text-xl">
        Добавление товара
      </h2>
      <Label for="name">Название</Label>
      <Input v-model="form.name" id="name" type="text" class="border-2 border-ui-primary"
        placeholder="Введите название товара" />
      <Label>Категория</Label>
      <Select v-model="form.type">
        <SelectTrigger class="border-2 border-ui-primary w-full">
          <SelectValue placeholder="Выберите категорию товара" />
        </SelectTrigger>
        <SelectContent class="border-2 border-ui-primary">
          <SelectGroup>
            <SelectItem v-for="item in Object.keys(productTypeEnum)" :value="item">
              {{ productTypeEnum[item as keyof typeof productTypeEnum] }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label for="price">Цена</Label>
      <Input v-model="form.price" id="price" type="number" class="border-2 border-ui-primary"
        placeholder="Введите цену товара" />
      <Label for="quantity">Наличие</Label>
      <Input v-model="form.quantity" id="quantity" type="number" class="border-2 border-ui-primary"
        placeholder="Введите кол-во товара" />
      <Label for="image">Изображения (до 3-х изображений включительно)</Label>
      <input @change="handleUploadImage"
        class="flex h-10 w-full rounded-md border-2 border-ui-primary bg-background px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium"
        id="image" type="file" multiple accept="image/*" />

      <Label for="description">Описание</Label>
      <textarea v-model="form.description" id="description" class="border-2 border-ui-primary p-2 rounded-md resize-y"
        placeholder="Введите описание товара"></textarea>

      <DialogFooter>
        <Button @click="handleSubmit" :disabled="isFormLoading" class="w-full bg-ui-primary">
          Добавить товар
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
