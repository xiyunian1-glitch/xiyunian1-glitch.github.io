<template>
  <aside v-if="items.length" class="article-toc-rail" aria-label="文章目录">
    <nav class="article-toc-panel" aria-label="文章目录">
      <button class="article-toc-trigger" type="button" aria-label="文章目录">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div class="article-toc-links">
        <a
          v-for="item in items"
          :key="`${item.href}-${item.depth}-${item.title}`"
          :href="item.href"
          class="article-toc-link"
          :style="{ paddingLeft: `${item.depth * 0.78}rem` }"
        >
          {{ item.title }}
        </a>
      </div>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>
