<template>
  <section ref="homeContentRef" class="content-shell home-content-shell">
    <section class="home-hero" aria-labelledby="home-hero-title">
      <div class="home-hero-copy">
        <h1 id="home-hero-title" class="home-hero-title">
          <span>Hi, 我是 <em class="home-hero-gradient-text">惜余年</em></span>
          <span>正在把 <em class="home-hero-gradient-text">AI 项目</em> 和真实业务练习写成成长记录</span>
          <span>这里保留我做过的系统、踩过的坑和逐步变清楚的工程判断。</span>
        </h1>
      </div>

      <div class="home-hero-visual">
        <div class="home-tech-orbit home-tech-orbit-outer" aria-hidden="true">
          <div
            v-for="(stack, index) in outerOrbitStacks"
            :key="stack.name"
            class="home-tech-node"
            :style="orbitItemStyle(index, outerOrbitStacks.length)"
          >
            <span class="home-tech-node-upright">
              <span class="home-tech-node-float">
                <img :src="stack.icon" :class="stack.iconClass" alt="">
              </span>
            </span>
          </div>
        </div>

        <div class="home-tech-orbit home-tech-orbit-inner" aria-hidden="true">
          <div
            v-for="(stack, index) in innerOrbitStacks"
            :key="stack.name"
            class="home-tech-node"
            :style="orbitItemStyle(index, innerOrbitStacks.length)"
          >
            <span class="home-tech-node-upright">
              <span class="home-tech-node-float">
                <img :src="stack.icon" :class="stack.iconClass" alt="">
              </span>
            </span>
          </div>
        </div>

        <div class="home-hero-avatar-shell">
          <div class="home-hero-avatar-glow" />
          <img class="home-hero-avatar-image" src="/avatar.png" alt="惜余年的头像">
        </div>
      </div>
    </section>

    <article class="home-copy">
      <p>
        我想把这个博客做成一个长期更新的成长档案，而不是只放项目截图的展示页。每一篇文章都会围绕一次真实实践展开：为什么做、怎么拆、最后我学到了什么。
      </p>
      <p>
        目前先放三篇记录：WMS 智能仓储辅助决策系统、OmniAI 本地优先 AI 创作工作台、Manga2Novel 漫画转小说工具。它们都和 AI 应用落地有关，但关注点不同。
      </p>
      <p>
        <span class="home-skills-title">我正在练习的方向</span><br>
        <span v-for="item in skills" :key="item.name" class="skill-tag">
          <img v-if="item.icon" :src="item.icon" :alt="item.name" class="skill-tag-icon">
          {{ item.name }}
        </span>
      </p>
      <p>
        你可以从 <RouterLink class="text-link" to="/posts">文章</RouterLink> 阅读完整记录，到 <RouterLink class="text-link" to="/projects">项目</RouterLink> 浏览项目定位，也可以在 <RouterLink class="text-link" to="/videos">AI视频</RouterLink> 里沉淀生成作品。
      </p>
      <p>
        <a :href="site.github" target="_blank" rel="noreferrer" class="text-link">
          <img src="/my_icons/github.svg" alt="" class="social-icon social-icon-mono">
          GitHub
        </a>
      </p>
    </article>

    <section class="home-analytics-shell" aria-label="博客概览">
      <div class="home-analytics-grid">
        <article v-for="card in cards" :key="card.label" class="home-analytics-card">
          <div class="home-analytics-card-head">
            <p class="home-analytics-card-title">{{ card.label }}</p>
            <p class="home-analytics-card-caption">{{ card.caption }}</p>
          </div>
          <p class="home-analytics-card-value">{{ card.value }}</p>
          <div class="home-analytics-card-change">
            <span class="home-analytics-card-change-icon" aria-hidden="true">↗</span>
            <span>{{ card.tag }}</span>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
import { animate } from 'motion-v'
import { onMounted, ref } from 'vue'
import { posts } from '../lib/posts'
import { setPageTitle, site } from '../lib/page'

const homeContentRef = ref(null)

const outerOrbitStacks = [
  { name: 'qwen', icon: '/tech_stack_icons/qwen.svg' },
  { name: 'openai', icon: '/tech_stack_icons/openai.svg', iconClass: 'home-tech-icon-mono' },
  { name: 'gemini', icon: '/tech_stack_icons/gemini.svg' },
  { name: 'cursor', icon: '/tech_stack_icons/cursor.svg', iconClass: 'home-tech-icon-mono' },
]

const innerOrbitStacks = [
  { name: 'react', icon: '/my_tech_stack_icons/react.svg' },
  { name: 'vue', icon: '/my_tech_stack_icons/vue.svg' },
  { name: 'vite', icon: '/my_tech_stack_icons/vite.svg' },
]

const skills = [
  { name: 'AI 应用' },
  { name: 'Vue', icon: '/my_tech_stack_icons/vue.svg' },
  { name: 'React', icon: '/my_tech_stack_icons/react.svg' },
  { name: 'Spring Boot' },
  { name: 'Next.js' },
  { name: 'Docker', icon: '/my_tech_stack_icons/docker.svg' },
  { name: 'SQL Server' },
  { name: '本地优先' },
]

const cards = [
  { label: '文章', caption: '成长记录', value: posts.length, tag: '静态保存' },
  { label: '项目', caption: 'AI 实践', value: '3', tag: '持续整理' },
  { label: 'AI视频', caption: '生成分享', value: '新', tag: '准备更新' },
]

function orbitItemStyle(index, total) {
  return {
    '--orbit-angle': `${(360 / total) * index}deg`,
    '--float-delay': `${index * 0.55}s`,
  }
}

function playHomeEntryAnimation() {
  const targets = Array.from(homeContentRef.value?.querySelectorAll('.home-hero-title > span, .home-hero-visual, .home-copy > *, .home-analytics-shell') ?? [])
  animate(
    targets,
    {
      opacity: [0, 1],
      filter: ['blur(8px)', 'blur(0px)'],
      transform: ['translateY(-8px)', 'translateY(0px)'],
    },
    {
      duration: 0.95,
      delay: index => 0.1 + index * 0.07,
      ease: [0, 0, 0.2, 1],
      fill: 'both',
    },
  )
}

onMounted(() => {
  setPageTitle('')
  playHomeEntryAnimation()
})
</script>
