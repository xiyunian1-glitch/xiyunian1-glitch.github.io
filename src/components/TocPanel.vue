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
          :class="{ 'article-toc-link-active': item.href === activeHref }"
          :style="{ paddingLeft: `${item.depth * 0.78}rem` }"
        >
          {{ item.title }}
        </a>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const activeHref = ref('')
let observer

function setupObserver() {
  observer?.disconnect()
  if (typeof window === 'undefined' || !props.items.length)
    return

  const headings = props.items
    .map(item => document.querySelector(item.href))
    .filter(Boolean)

  if (!headings.length)
    return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting)
          activeHref.value = `#${entry.target.id}`
      }
    },
    { rootMargin: '-100px 0px -66% 0px', threshold: 0 },
  )
  headings.forEach(heading => observer.observe(heading))
}

onMounted(setupObserver)
watch(() => props.items, setupObserver)
onBeforeUnmount(() => observer?.disconnect())
</script>
