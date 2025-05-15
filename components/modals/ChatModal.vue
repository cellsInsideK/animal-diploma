<script setup lang="ts">
  type Chat = {
    type: 'bot' | 'user',
    message: string
  }

  const isVisible = defineModel<boolean>('isVisible');
  const message = ref('');
  const messages = ref<Chat[]>([
    { type: 'bot', message: 'Привет! Я ассистент зоомагазина “Тузик”. Чем могу быть полезен?' },
  ])

  const sendMessage = () => {
    if (message.value.trim() === '') {
      return
    }

    messages.value.push({ type: 'user', message: message.value });
    message.value = '';
    // запрос с ответным сообщением
    messages.value.push({ type: 'bot', message: 'Сообщение от ассистента' })
  }
</script>

<template>
  <Dialog v-model:open="isVisible">
    <DialogContent class="max-w-lg w-full h-[80%] flex flex-col">
      <div class="flex flex-col gap-4 w-full h-full overflow-y-auto">
        <template v-for="message in messages">
          <div class="max-w-[280px] p-4 rounded-xl border-2 border-ui-primary"
            :class="message.type === 'bot' ? 'bg-ui-primary text-white' : 'text-ui-primary ml-auto'">
            {{ message.message }}
          </div>
        </template>
      </div>
      <div class="flex gap-3 max-h-[50px] h-full">
        <Input @change="sendMessage" v-model="message" class="border-2 border-ui-primary h-full"
          placeholder="Введите текст..." />
        <Button @click="sendMessage" class="bg-ui-primary cursor-pointer h-full">отправить</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>