import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: DataIpView,
      component: HomeView,
      // meta: { showNavTop: true, requiresAuth: true }
      meta: { showNavTop: true }
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
    },

    {
      path: '/database',
      name: 'Database IP MFU',
      component: () => import('../views/DataIpView.vue'),
      meta: { showNavTop: true }
    },
    {
      path: '/user/profile',
      name: 'Profile',
      component: () => import('../views/UserView/ProfileView.vue'),
      meta: { showNavTop: true, requiresAuth: true }
    },

   // catch all 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
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
