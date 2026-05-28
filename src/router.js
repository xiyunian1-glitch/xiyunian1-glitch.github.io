import HomePage from './pages/HomePage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
import PostDetailPage from './pages/PostDetailPage.vue'
import PostsPage from './pages/PostsPage.vue'
import ProjectsPage from './pages/ProjectsPage.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsPage,
  },
  {
    path: '/posts/:slug',
    name: 'post-detail',
    component: PostDetailPage,
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
]
