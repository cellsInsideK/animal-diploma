<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { toast } from 'vue-sonner';
  import { Dialog, DialogContent, DialogFooter } from '../ui/dialog';
  import { Button } from '../ui/button';
  import { Input } from '../ui/input';
  import { Label } from '../ui/label';
  import type { SelectProducts } from '~/server/database/schema';
  import { createClient } from "@supabase/supabase-js";

  type Body = { images: string[] } & SelectProducts;

  const { product } = defineProps<{ product: SelectProducts }>();
  const isOpen = defineModel<boolean>('isOpen');
  const emit = defineEmits<{
    (e: 'updated'): void
  }>();

  const form = reactive<Body>({} as Body);
  const config = useRuntimeConfig();

  watch(() => product, (newProduct) => {
    form.id = newProduct.id;
    form.name = newProduct.name;
    form.type = newProduct.type;
    form.description = newProduct.description;
    form.price = newProduct.price;
    form.quantity = newProduct.quantity;
    form.images = [];
  })

  const isFormLoading = ref(false);

  const handleUploadImage = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;

    isFormLoading.value = true;

    for (let i = 0; i < files.length; i++) {
      if (i >= 3) {
        break;
      }

      const supabase = createClient(config.public.url, config.public.key);


      const fileName = createImageHash(1000, 9999, files[i].name);
      const { data, error } = await supabase.storage.from('images').upload(fileName, files[i]);

      form.images.push(fileName);

      if (error) {
        toast.error('Ошибка', { description: 'Не удалось загрузить изображения' });
        return isFormLoading.value = false;
      }
    }

    isFormLoading.value = false;

    return toast.success('Изображения изменены');
  }

  const handleSubmit = async () => {
    if (form.name.trim() === '' || form.price <= 0 || form.quantity <= 0 || form.description.trim() === '') {
      return toast.error('Ошибка', { description: 'Необходимо заполнить все поля' });
    }

    isFormLoading.value = true;
    const res = await $fetch(`/api/products/${product.id}`, { method: 'PATCH', body: { ...form } });
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
      <h2 class="items-center font-extrabold text-xl">
        Изменение товара
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
      <Label for="image">Изображения (до 3-х изображений, старые будут удалены)</Label>
      <input @change="handleUploadImage"
        class="flex h-10 w-full rounded-md border-2 border-ui-primary bg-background px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium"
        id="image" type="file" multiple accept="image/*" />

      <Label for="description">Описание</Label>
      <textarea v-model="form.description" id="description" class="border-2 border-ui-primary p-2 rounded-md resize-y"
        placeholder="Введите описание товара"></textarea>

      <DialogFooter>
        <Button @click="handleSubmit" :disabled="isFormLoading" class="w-full bg-ui-primary">
          Изменить товар
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
