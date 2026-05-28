<template>
  <section class="content-shell">
    <header class="page-hero">
      <div class="page-hero-copy">
        <p class="section-title">项目</p>
        <h1 class="page-heading">项目索引</h1>
        <p class="page-intro">
          先把三个项目作为成长记录入口保留下来，后续可以继续补截图、仓库链接和在线演示。
        </p>
      </div>
    </header>

    <div class="project-list">
      <RouterLink v-for="item in posts" :key="item.slug" :to="`/posts/${item.slug}`" class="simple-card">
        <div class="simple-card-title">{{ item.title }}</div>
        <p class="simple-card-desc">{{ item.summary }}</p>
        <div class="simple-card-meta">
          <span>{{ item.category }}</span>
          <span>{{ item.tags.map(tag => tag.name).slice(0, 4).join(' / ') }}</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { posts } from '../lib/posts'
import { setPageTitle } from '../lib/page'

onMounted(() => {
  setPageTitle('项目索引')
})
</script>
