<template>
  <section class="state-shell">
    <p class="section-title">{{ eyebrow }}</p>
    <h1 class="page-heading">{{ title }}</h1>
    <p class="page-intro">{{ description }}</p>
    <RouterLink v-if="to" :to="to" class="text-link">{{ actionLabel }}</RouterLink>
  </section>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  to: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '返回',
  },
})
</script>
