<script setup lang="ts">
  import WalkingModal from '~/components/modals/WalkingModal.vue';

  const isVisible = ref(false);
  useHead({ title: 'Выгул и передержка' });
</script>

<template>
  <UISection>
    <WalkingModal v-model:is-visible="isVisible" />
    <h2 class="font-bold text-ui-primary text-xl md:text-2xl mb-5">Выгул и передержка</h2>
    <img src="/walking.png" class="w-full max-h-[400px] rounded-md mb-5" alt="">
    <h3 class="font-bold text-ui-primary text-xl md:text-2xl mb-5">Что это такое?</h3>
    <p class="font-semibold text-lg text-justify mb-5">
      Иногда вам нужно уехать, задержаться на работе или просто отдохнуть, в такие моменты важно быть уверенным, что ваш
      питомец в надёжных руках. Выгул — это индивидуальные прогулки с вашим питомцем по заранее согласованному маршруту
      и графику. Наши исполнители ответственные, проверенные и любят животных. Передержка — временный уход за животным
      на дому у проверенного ситтера или в специально оборудованном месте. Мы подбираем условия, максимально
      приближённые к домашним. Вы отдыхаете, питомец в заботе и безопасности.
    </p>
    <div class="flex w-full justify-center">
      <Button @click="isVisible = true" class="w-fit px-12 py-5 bg-ui-primary cursor-pointer">Оставить заявку</Button>
    </div>
  </UISection>
</template>