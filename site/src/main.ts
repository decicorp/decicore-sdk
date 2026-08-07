import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomePage     from './pages/HomePage.vue'
import CommunityPage from './pages/CommunityPage.vue'
import DocsLayout   from './pages/DocsLayout.vue'

import Introduction  from './pages/Introduction.vue'
import GettingStarted from './pages/GettingStarted.vue'
import CrudOperations from './pages/CrudOperations.vue'
import AiInference   from './pages/AiInference.vue'
import UsersApi      from './pages/UsersApi.vue'
import BillingApi    from './pages/BillingApi.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',          component: HomePage },
    { path: '/community', component: CommunityPage },
    {
      path: '/docs',
      component: DocsLayout,
      redirect: '/docs/introduction',
      children: [
        { path: 'introduction',    component: Introduction },
        { path: 'getting-started', component: GettingStarted },
        { path: 'crud',            component: CrudOperations },
        { path: 'ai-inference',    component: AiInference },
        { path: 'users',           component: UsersApi },
        { path: 'billing',         component: BillingApi },
      ],
    },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 90 }
    return { top: 0, behavior: 'smooth' }
  },
})

createApp(App).use(router).mount('#app')
