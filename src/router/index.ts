import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Poll from '@/views/Poll.vue';
/* import Login from '@/views/Login.vue';
import ClientDetail from '@/views/ClientDetail.vue';
import Poll from '@/views/Poll.vue';
import CompleteTask from '@/views/CompleteTask.vue'; */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/poll',
    component: Poll
  }
  /* {
    path: '/home',
    component: Home
  },
  {
    path: '/clientDetail',
    component: ClientDetail
  },
  {
    path: '/poll',
    component: Poll
  },
  {
    path: '/complete',
    component: CompleteTask
  } */
  /* {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3.vue')
      }
    ] */
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
