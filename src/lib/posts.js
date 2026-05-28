import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const modules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

function parseFrontmatter(raw) {
  const normalizedRaw = raw.replace(/^\uFEFF/, '')
  const match = normalizedRaw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match)
    return { data: {}, content: normalizedRaw }

  const data = {}
  const [, frontmatter, content] = match
  frontmatter.split(/\r?\n/).forEach((line) => {
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
    else if (rawValue === 'true' || rawValue === 'false') {
      data[key] = rawValue === 'true'
    }
    else {
      data[key] = rawValue.replace(/^['"]|['"]$/g, '')
    }
  })

  return { data, content }
}

function estimateReadingTime(content) {
  const text = content.replace(/```[\s\S]*?```/g, '').replace(/[#>*_\-[\]()`]/g, '')
  const chars = text.replace(/\s/g, '').length
  return Math.max(1, Math.ceil(chars / 500))
}

function normalizeTags(tags = []) {
  return tags.map(tag => ({
    name: String(tag),
    slug: String(tag).toLowerCase(),
  }))
}

function renderMarkdown(content) {
  const env = {}
  const html = md.render(content, env)
  return html.replace(/<h([2-4])>(.*?)<\/h\1>/g, (_match, level, title) => {
    const plainTitle = title.replace(/<[^>]+>/g, '')
    const id = plainTitle
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
    return `<h${level} id="${id}">${title}</h${level}>`
  })
}

function extractToc(html) {
  const items = []
  const headingPattern = /<h([2-4]) id="([^"]+)">(.+?)<\/h\1>/g
  let match

  while ((match = headingPattern.exec(html))) {
    items.push({
      depth: Number(match[1]) - 2,
      href: `#${match[2]}`,
      title: match[3].replace(/<[^>]+>/g, ''),
    })
  }

  return items
}

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = slugFromPath(path)
    const html = renderMarkdown(content.replace(/^# .+$/m, '').trim())

    return {
      slug,
      title: data.title,
      summary: data.description,
      published_at: data.published,
      category: data.category || '成长记录',
      tags: normalizeTags(data.tags || []),
      reading_time: estimateReadingTime(content),
      content_html: html,
      toc: extractToc(html),
    }
  })
  .filter(post => post.title)
  .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))

export function getPost(slug) {
  return posts.find(post => post.slug === slug)
}

export function getStaticRoutes() {
  return posts.map(post => `/posts/${post.slug}`)
}
