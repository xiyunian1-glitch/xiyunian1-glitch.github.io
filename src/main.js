import 'virtual:uno.css'
import './styles.css'

import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import { getStaticRoutes } from './lib/posts'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to) {
      if (to.hash)
        return { el: to.hash, top: 88, behavior: 'smooth' }

      return { top: 0, behavior: 'smooth' }
    },
  },
)

export async function includedRoutes(paths) {
  const dynamicRoutes = getStaticRoutes()
  const staticRoutes = paths.filter(path => !path.includes(':'))
  return Array.from(new Set([...staticRoutes, ...dynamicRoutes]))
}
