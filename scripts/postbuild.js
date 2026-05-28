import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : path
  }))

  return files.flat()
}

const htmlFiles = (await walk('dist')).filter(file => file.endsWith('.html'))

await Promise.all(htmlFiles.map(async (file) => {
  const html = await readFile(file, 'utf8')
  await writeFile(file, html.replace('<html lang="en">', '<html lang="zh-CN">'))
}))
