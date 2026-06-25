import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// 站点配置 —— canonical / OG / RSS / sitemap 统一用主站地址
const SITE_URL = 'https://blog.kitnav.com'
const SITE_NAME = '惜余年的个人博客'
const SITE_DESC = '记录 AI 项目、技术实践和成长过程。'
const DEFAULT_OG_IMAGE = `${SITE_URL}/avatar.png`
const POSTS_DIR = 'src/content/posts'

// ---------- 通用工具 ----------

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : path
  }))

  return files.flat()
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 解析 markdown frontmatter，与 src/lib/posts.js 对齐，只取 SEO/Feed 需要的字段
function parseFrontmatter(raw) {
  const normalized = raw.replace(/^﻿/, '')
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match)
    return {}

  const data = {}
  match[1].split(/\r?\n/).forEach((line) => {
    const separator = line.indexOf(':')
    if (separator === -1)
      return

    const key = line.slice(0, separator).trim()
    const rawValue = line.slice(separator + 1).trim()
    if (!key)
      return

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      data[key] = rawValue
        .slice(1, -1)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    }
    else {
      data[key] = rawValue.replace(/^['"]|['"]$/g, '')
    }
  })

  return data
}

async function loadPosts() {
  const files = (await readdir(POSTS_DIR)).filter(file => file.endsWith('.md'))
  const posts = await Promise.all(files.map(async (file) => {
    const raw = await readFile(join(POSTS_DIR, file), 'utf8')
    const data = parseFrontmatter(raw)
    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title || file,
      description: data.description || SITE_DESC,
      published: data.published || '',
      tags: data.tags || [],
    }
  }))

  return posts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.published) - new Date(a.published))
}

// ---------- <head> 注入 ----------

function buildHeadTags({ title, description, url, type = 'website', image = DEFAULT_OG_IMAGE, extra = '' }) {
  return [
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<link rel="canonical" href="${url}">`,
    // RSS 自动发现，方便阅读器订阅
    `<link rel="alternate" type="application/rss+xml" title="${escapeHtml(SITE_NAME)}" href="${SITE_URL}/rss.xml">`,
    extra,
  ].filter(Boolean).join('\n    ')
}

function applyHead(html, meta) {
  let out = html

  if (meta.title)
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)

  if (meta.description) {
    out = out.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${escapeHtml(meta.description)}">`,
    )
  }

  // 幂等保护：避免重复注入
  if (!out.includes('property="og:title"'))
    out = out.replace('</head>', `    ${buildHeadTags(meta)}\n  </head>`)

  return out
}

// ---------- RSS / sitemap / robots ----------

function rfc822Date(dateStr) {
  return new Date(dateStr).toUTCString()
}

function buildRSS(posts) {
  const items = posts.map((post) => {
    const url = `${SITE_URL}/posts/${post.slug}/`
    const categories = post.tags
      .map(tag => `      <category>${escapeXml(tag)}</category>`)
      .join('\n')

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822Date(post.published)}</pubDate>
      <description>${escapeXml(post.description)}</description>
${categories}
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
}

function buildSitemap(posts) {
  const today = new Date().toISOString().slice(0, 10)
  const staticUrls = [
    { loc: `${SITE_URL}/`, lastmod: today, priority: '1.0' },
    { loc: `${SITE_URL}/posts/`, lastmod: today, priority: '0.9' },
    { loc: `${SITE_URL}/projects/`, lastmod: today, priority: '0.6' },
    { loc: `${SITE_URL}/videos/`, lastmod: today, priority: '0.5' },
  ]
  const postUrls = posts.map(post => ({
    loc: `${SITE_URL}/posts/${post.slug}/`,
    lastmod: post.published || today,
    priority: '0.8',
  }))

  const body = [...staticUrls, ...postUrls].map(item => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

// ---------- 主流程 ----------

const posts = await loadPosts()
const postBySlug = Object.fromEntries(posts.map(post => [post.slug, post]))

const htmlFiles = (await walk('dist')).filter(file => file.endsWith('.html'))

await Promise.all(htmlFiles.map(async (file) => {
  let html = await readFile(file, 'utf8')
  html = html.replace('<html lang="en">', '<html lang="zh-CN">')

  // 由文件相对路径决定该页的 meta 配置
  const rel = file.replace(/^dist[/\\]/, '').replace(/\\/g, '/')
  let meta = null

  if (rel === 'index.html') {
    meta = { title: SITE_NAME, description: SITE_DESC, url: `${SITE_URL}/` }
  }
  else if (rel === 'posts/index.html') {
    meta = { title: `文章 · ${SITE_NAME}`, description: `${SITE_NAME}的成长记录与技术实践文章列表。`, url: `${SITE_URL}/posts/` }
  }
  else if (rel === 'projects/index.html') {
    meta = { title: `项目 · ${SITE_NAME}`, description: `${SITE_NAME}做过的项目整理。`, url: `${SITE_URL}/projects/` }
  }
  else if (rel === 'videos/index.html') {
    meta = { title: `AI 视频 · ${SITE_NAME}`, description: `${SITE_NAME}分享的 AI 相关视频。`, url: `${SITE_URL}/videos/` }
  }
  else {
    const match = rel.match(/^posts\/([^/]+)\/index\.html$/)
    const post = match ? postBySlug[match[1]] : null
    if (post) {
      const extra = [
        post.published ? `<meta property="article:published_time" content="${new Date(post.published).toISOString()}">` : '',
        ...post.tags.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}">`),
      ].filter(Boolean).join('\n    ')

      meta = {
        title: `${post.title} · ${SITE_NAME}`,
        description: post.description,
        url: `${SITE_URL}/posts/${post.slug}/`,
        type: 'article',
        extra,
      }
    }
  }

  if (meta)
    html = applyHead(html, meta)

  await writeFile(file, html)
}))

// 生成 RSS、sitemap、robots
await writeFile('dist/rss.xml', buildRSS(posts))
await writeFile('dist/sitemap.xml', buildSitemap(posts))
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
