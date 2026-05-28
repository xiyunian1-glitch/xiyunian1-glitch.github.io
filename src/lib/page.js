export const site = {
  title: '惜余年的个人博客',
  owner: '惜余年',
  description: '记录 AI 项目、技术实践和成长过程。',
  github: 'https://github.com/xiyunian1-glitch',
}

export function setPageTitle(title) {
  if (typeof document === 'undefined')
    return

  document.title = title ? `${title} | ${site.title}` : site.title
}

export function formatDate(value, options = {}) {
  if (!value)
    return '未发布'

  return new Intl.DateTimeFormat('zh-CN', {
    year: options.year ?? 'numeric',
    month: options.month ?? 'short',
    day: options.day ?? 'numeric',
  }).format(new Date(value))
}

export function formatMonthDay(value) {
  return formatDate(value, { year: undefined, month: 'short', day: 'numeric' })
}
