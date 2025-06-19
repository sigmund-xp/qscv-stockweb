import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import EtiquetaView from '@/views/EtiquetaView.vue'
import BodegaView from '@/views/BodegaView.vue'
import CepaView from '@/views/CepaView.vue'
import LoginView from '@/views/LoginView.vue'
import StockView from '@/views/StockView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'home',
    component: HomeView
  },
  {
    path: '/stock',
    name: 'stock',
    component: StockView
  },
  {
    path: '/etiquetas',
    name: 'etiquetas',
    component: EtiquetaView
  },
  {
    path: '/bodegas',
    name: 'bodegas',
    component: BodegaView
  },
  {
    path: '/cepas',
    name: 'cepas',
    component: CepaView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
