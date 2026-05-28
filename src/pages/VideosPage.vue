<template>
  <section class="content-shell">
    <header class="page-hero">
      <div class="page-hero-copy">
        <p class="section-title">AI视频</p>
        <h1 class="page-heading">AI 视频分享</h1>
        <p class="page-intro">
          这里用来整理我生成的 AI 视频作品，保留画面、工具、提示词思路和生成复盘。
        </p>
      </div>
    </header>

    <div v-if="aiVideos.length" class="video-grid">
      <article v-for="video in aiVideos" :key="video.title" class="video-card">
        <video
          v-if="video.src"
          class="video-player"
          :src="video.src"
          :poster="video.poster"
          controls
          playsinline
          preload="metadata"
        />
        <div v-else class="video-placeholder">
          <span>{{ video.badge || 'AI' }}</span>
        </div>
        <div class="video-card-body">
          <h2 class="video-title">{{ video.title }}</h2>
          <p class="video-desc">{{ video.description }}</p>
          <div class="simple-card-meta">
            <span>{{ video.tool }}</span>
            <span>{{ video.date }}</span>
          </div>
        </div>
      </article>
    </div>

    <section v-else class="video-empty">
      <p class="section-title">作品整理中</p>
      <h2>下一步会放生成视频</h2>
      <p>
        你把视频文件、封面图、标题和生成工具发给我后，我会直接补进这个页面。
      </p>
    </section>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { aiVideos } from '../data/videos'
import { setPageTitle } from '../lib/page'

onMounted(() => {
  setPageTitle('AI 视频分享')
})
</script>
