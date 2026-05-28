<template>
  <section class="content-shell">
    <header class="page-hero">
      <div class="page-hero-copy">
        <p class="section-title">Blog</p>
        <h1 class="page-heading">成长记录</h1>
        <p class="page-intro">
          这里暂时只保留三篇文章，记录我把 AI、前端、后端、数据和部署串起来的过程。
        </p>
      </div>
    </header>

    <div class="entry-list">
      <section v-for="group in groups" :key="group.year">
        <h2 class="entry-year">{{ group.year }}</h2>
        <RouterLink
          v-for="item in group.items"
          :key="item.slug"
          :to="`/posts/${item.slug}`"
          class="entry-row"
        >
          <div class="entry-main">
            <div class="entry-row-head">
              <div class="entry-title">{{ item.title }}</div>
              <div class="entry-meta">
                <span>{{ formatMonthDay(item.published_at) }}</span>
                <span>/</span>
                <span>{{ item.reading_time }}min</span>
              </div>
            </div>
            <p class="entry-summary">{{ item.summary }}</p>
          </div>
        </RouterLink>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { posts } from '../lib/posts'
import { formatMonthDay, setPageTitle } from '../lib/page'

const groups = computed(() => {
  const map = new Map()
  posts.forEach((item) => {
    const year = new Date(item.published_at).getFullYear()
    if (!map.has(year))
      map.set(year, [])
    map.get(year).push(item)
  })

  return Array.from(map.entries()).map(([year, items]) => ({ year, items }))
})

onMounted(() => {
  setPageTitle('成长记录')
})
</script>
