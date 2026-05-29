<template>
  <div class="site-shell">
    <BackgroundGrid v-if="shouldRenderBackground" />
    <div class="top-glow" />

    <div class="site-layer">
      <header class="site-header" :class="{ 'header-hidden': headerHidden }">
        <RouterLink to="/" class="site-logo" aria-label="返回首页">
          <span class="site-logo-mark">惜</span>
          <span class="site-logo-text">惜余年</span>
        </RouterLink>

        <nav class="site-nav" aria-label="主导航">
          <RouterLink :class="navClass('/posts')" to="/posts">文章</RouterLink>
          <RouterLink :class="navClass('/projects')" to="/projects">项目</RouterLink>
          <RouterLink :class="navClass('/videos')" to="/videos">AI视频</RouterLink>
          <a class="site-nav-icon" :href="site.github" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
            <AppIcon name="github" />
          </a>
        </nav>
      </header>

      <main class="site-main">
        <slot />
        <div v-if="!isHomePage" class="back-parent">
          <span class="font-mono text-[var(--c-soft)]" aria-hidden="true">&gt;</span>
          <RouterLink :to="parentPath" class="text-link">返回上一级</RouterLink>
        </div>
      </main>

      <footer class="site-footer">
        <div class="site-footer-line" />
        <p>Copyright 2026 惜余年。静态博客托管于 GitHub Pages。</p>
        <p class="site-credit">前端视觉参考开源模板，遵循 MIT 开源协议。</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'
import BackgroundGrid from './BackgroundGrid.vue'
import { site } from '../lib/page'

const route = useRoute()
const shouldRenderBackground = ref(false)
const headerHidden = ref(false)
let lastScrollY = 0

const isHomePage = computed(() => route.path === '/')
const parentPath = computed(() => {
  if (route.path === '/' || route.name === 'not-found')
    return '/'

  const segments = route.path.split('/').filter(Boolean)
  segments.pop()
  return segments.length ? `/${segments.join('/')}` : '/'
})

function navClass(prefix) {
  return [
    'site-nav-link',
    route.path === prefix || route.path.startsWith(`${prefix}/`) ? 'site-nav-link-active' : '',
  ]
}

function onScroll() {
  const currentY = window.scrollY
  if (currentY < 80) {
    headerHidden.value = false
  }
  else if (currentY - lastScrollY > 10) {
    headerHidden.value = true
  }
  else if (lastScrollY - currentY > 10) {
    headerHidden.value = false
  }
  lastScrollY = currentY
}

onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })

  window.setTimeout(() => {
    shouldRenderBackground.value = true
  }, 160)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
