<template>
  <section class="content-shell">
    <StateBlock
      eyebrow="404"
      title="页面不存在"
      description="这个页面已经不存在，或者地址写错了。"
      to="/"
      action-label="返回首页"
    />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import StateBlock from '../components/StateBlock.vue'
import { setPageTitle } from '../lib/page'

onMounted(() => {
  setPageTitle('页面不存在')
})
</script>
