import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { showNavTop: true}
    },
    {
      path: '/about',
      name: 'about',
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
    }

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
