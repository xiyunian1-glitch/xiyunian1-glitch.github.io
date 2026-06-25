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
          <img class="home-hero-avatar-image" src="/avatar.png?v=20260625" alt="惜余年的头像">
        </div>
      </div>
    </section>

    <article class="home-copy home-card">
      <p>
        我把这个博客当成一份能往回翻的成长档案，而不是只摆截图的作品集。每篇文章都围绕一次真实实践展开：为什么做、怎么拆、最后我真正搞懂了什么。
      </p>

      <dl class="home-bio">
        <div class="home-bio-row">
          <dt class="home-bio-key">求职中</dt>
          <dd class="home-bio-val">计算机相关专业应届毕业，正在找一份开发工作，想把这些项目里积累的能力用进真实业务。</dd>
        </div>
        <div class="home-bio-row">
          <dt class="home-bio-key">在做</dt>
          <dd class="home-bio-val">把做过的系统整理成能讲清楚的项目，继续打磨工程基础，为正式工作做好准备。</dd>
        </div>
        <div class="home-bio-row">
          <dt class="home-bio-key">做过</dt>
          <dd class="home-bio-val">
            两个围绕 AI 落地的项目，关注点各不相同：
            <ul class="home-bio-projects">
              <li v-for="p in projects" :key="p.slug">
                <RouterLink class="text-link" :to="`/posts/${p.slug}`">{{ p.name }}</RouterLink>
                <span class="home-bio-project-note"> — {{ p.note }}</span>
              </li>
            </ul>
          </dd>
        </div>
        <div class="home-bio-row">
          <dt class="home-bio-key">在学</dt>
          <dd class="home-bio-val home-bio-skills">
            <span v-for="item in skills" :key="item.name" class="skill-tag">
              <img v-if="item.icon" :src="item.icon" :alt="item.name" class="skill-tag-icon">
              {{ item.name }}
            </span>
            <span class="home-bio-note">把它们当成把想法做出来的手段，而不是要收集的徽章。</span>
          </dd>
        </div>
        <div class="home-bio-row">
          <dt class="home-bio-key">联系</dt>
          <dd class="home-bio-val">
            <div class="home-social">
              <button
                type="button"
                class="home-social-btn"
                :aria-label="wechatShown ? '微信号 xiyunianY，点击复制' : '显示并复制微信号'"
                title="点击复制微信号"
                @click="copyWechat"
              >
                <img src="/my_icons/wechat.svg" alt="" class="social-icon-mono">
                <code v-if="wechatShown" class="home-wechat-id">xiyunianY</code>
                <span v-if="wechatCopied" class="home-wechat-copied">已复制</span>
              </button>
              <a class="home-social-icon" :href="site.github" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
                <img src="/my_icons/github.svg" alt="" class="social-icon-mono">
              </a>
            </div>
          </dd>
        </div>
      </dl>
    </article>

    <section class="home-recent" aria-label="最近文章">
      <div class="home-recent-head">
        <p class="section-title">最近写的</p>
        <RouterLink to="/posts" class="home-recent-more">全部文章 →</RouterLink>
      </div>
      <div class="home-recent-list">
        <RouterLink
          v-for="item in recentPosts"
          :key="item.slug"
          :to="`/posts/${item.slug}`"
          class="home-recent-item"
        >
          <span class="home-recent-item-title">{{ item.title }}</span>
          <span class="home-recent-item-date">{{ formatMonthDay(item.published_at) }}</span>
        </RouterLink>
      </div>
    </section>
  </section>
</template>

<script setup>
import { animate } from 'motion-v'
import { onMounted, ref } from 'vue'
import { posts } from '../lib/posts'
import { formatMonthDay, setPageTitle, site } from '../lib/page'

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

const recentPosts = posts.slice(0, 3)

const projects = [
  { name: 'WMS 智能仓储辅助决策系统', slug: 'wms-ai-assistant-graduation', note: '我的毕业设计：第一次把 AI 从聊天框接进有登录、有数据、有权限的真实业务系统。' },
  { name: 'AI 聚合站', slug: 'ai-aggregator-ppt-mult-agent', note: '从一个图片创作平台，长成一个用多 Agent 协作自动生成可编辑 PPT 的系统。' },
]

const wechatShown = ref(false)
const wechatCopied = ref(false)
let wechatTimer = null

async function copyWechat() {
  wechatShown.value = true
  try {
    await navigator.clipboard.writeText('xiyunianY')
    wechatCopied.value = true
  }
  catch {
    // clipboard 不可用（非 HTTPS / 旧浏览器）：静默降级，微信号已就地展示可手动复制
  }
  clearTimeout(wechatTimer)
  wechatTimer = setTimeout(() => {
    wechatCopied.value = false
  }, 1600)
}

function orbitItemStyle(index, total) {
  return {
    '--orbit-angle': `${(360 / total) * index}deg`,
    '--float-delay': `${index * 0.55}s`,
  }
}

function playHomeEntryAnimation() {
  const targets = Array.from(homeContentRef.value?.querySelectorAll('.home-hero-title > span, .home-hero-visual, .home-copy > *, .home-recent') ?? [])
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
