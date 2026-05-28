<template>
  <section class="content-shell">
    <RouterLink to="/posts" class="subtle-link back-link">
      ← 返回文章列表
    </RouterLink>

    <StateBlock
      v-if="!post"
      eyebrow="404"
      title="文章不存在"
      description="这个地址没有对应的文章。"
      to="/posts"
      action-label="回到文章列表"
    />

    <article v-else>
      <TocPanel :items="post.toc" />
      <p class="section-title">{{ post.category }}</p>
      <h1 class="page-heading detail-heading">{{ post.title }}</h1>
      <p class="page-intro detail-summary">{{ post.summary }}</p>
      <div class="detail-meta-wrap">
        <ArticleMeta :date="post.published_at" :reading-time="post.reading_time" :tags="post.tags" />
      </div>
      <div class="article-content" v-html="post.content_html" />
    </article>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ArticleMeta from '../components/ArticleMeta.vue'
import StateBlock from '../components/StateBlock.vue'
import TocPanel from '../components/TocPanel.vue'
import { getPost } from '../lib/posts'
import { setPageTitle } from '../lib/page'

const route = useRoute()
const post = computed(() => getPost(route.params.slug))

function updateTitle() {
  setPageTitle(post.value?.title || '文章不存在')
}

onMounted(updateTitle)
watch(() => route.params.slug, updateTitle)
</script>
