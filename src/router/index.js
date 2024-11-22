import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/HomeView.vue'
import InnovaionDetail from '@/views/InnovationDetailView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      // component: DataIpView,
      component: HomeView,
      // meta: { showNavTop: true }
      meta: { showNavTop: true, requiresAuth: true }
    },
    {
      path: '/about',
    name: 'About',
      component: () => import('../views/AboutView.vue'),
      meta: { showNavTop: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { showNavTop: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: { showNavTop: true }
    },
    {
      path: '/innovation',
      name: 'Innovation',
      component: () => import('../views/InnovationView.vue'),
      meta: { showNavTop: true }
    },
    {
      path: '/services/ipp',
      name: 'Table Research',
      component: () => import('../views/TableResearch.vue'),
      meta: { showNavTop: true }
    },
    {
      path: '/database',
      name: 'Database IP MFU',
      component: () => import('../views/DataIpView.vue'),
      meta: { showNavTop: true }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/ContactView.vue'),
      meta: { showNavTop: true }
    },
    {
      path: '/detail/:id',
      name: 'Innovation Detail',
      component: InnovaionDetail,
      props: true,
      meta: { showNavTop: true }
    },
  ],
})

// requiresAuth: true 

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    next("/login");
  } else {
    next();
  }
});


export default router
