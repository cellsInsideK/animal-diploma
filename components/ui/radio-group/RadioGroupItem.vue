<script setup lang="ts">
  import type { RadioGroupItemProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/lib/utils'
  import { CircleIcon } from 'lucide-vue-next'
  import {
    RadioGroupIndicator,
    RadioGroupItem,

    useForwardProps,
  } from 'reka-ui'
  import { computed } from 'vue'

  const props = defineProps<RadioGroupItemProps & { class?: HTMLAttributes['class'] }>()

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props

    return delegated
  })

  const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RadioGroupItem data-slot="radio-group-item" v-bind="forwardedProps" :class="cn(
    'border-2 border-ui-primary text-ui-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-6 shrink-0 rounded-full shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  )
    ">
    <RadioGroupIndicator data-slot="radio-group-indicator" class="relative flex items-center justify-center">
      <CircleIcon class="fill-ui-primary absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2" />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
