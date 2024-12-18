import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/HomeView.vue'
import InnovationDetail from '@/views/InnovationDetailView.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      // component: DataIpView,
      component: HomeView,
      // meta: { showNavTop: true, requiresAuth: true }
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/about',
    name: 'About',
      component: () => import('../views/AboutView.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/innovation',
      name: 'Innovation',
      component: () => import('../views/InnovationView.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/services/ipp',
      name: 'Table Research',
      component: () => import('../views/TableResearchView.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/regulation',
      name: 'Regulation',
      component: () => import('../views/RegulationDemo.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/services/ipa',
      name: 'Request for Coverage',
      component: () => import('../views/RequestCoverageView.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/database',
      name: 'Database IP MFU',
      component: () => import('../views/DataIpView.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/ContactView.vue'),
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/detail/:id',
      name: 'Innovation Detail',
      component: InnovationDetail,
      props: true,
      meta: { showNavTop: true, showNavFooter: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/UserView/ProfileView.vue'),
      meta: { showNavTop: true, showNavFooter: true, requiresAuth: true }
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('../views/UserView/MessageView.vue'),
      meta: { showNavTop: true, showNavFooter: true, requiresAuth: true }
    },
    {
      path: '/admin/',
      name: 'Admin',
      component: () => import('../views/AdminView/index.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/userManage',
      name: 'User Manage',
      component: () => import('../views/AdminView/UserManageView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/documents',
      name: 'Documents',
      component: () => import('../views/AdminView/DocumentsView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/staff/',
      name: 'Staff',
      component: () => import('../views/StaffView/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['staff', 'admin']
      },
    },
    {
      path: '/staff/newPost',
      name: 'New Post',
      component: () => import('../views/StaffView/NewsPost.vue'),
      meta: { requiresAuth: true, roles: ['staff', 'admin'] },
    },
    {
      path: '/staff/researchManagement',
      name: 'Research Management',
      component: () => import('../views/StaffView/ResearchManagement.vue'),
      meta: { requiresAuth: true, roles: ['staff', 'admin'] },
    },
    {
      path: '/staff/searchManagement',
      name: 'Search Management',
      component: () => import('../views/StaffView/SearchManagement.vue'),
      meta: { requiresAuth: true, roles: ['staff', 'admin'] },
    },
    {
      path: '/staff/messageReply',
      name: 'Message Reply',
      component: () => import('../views/StaffView/MessageReply.vue'),
      meta: { requiresAuth: true, roles: ['staff', 'admin'] },
    },

   // catch all 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { showNavTop: true }
  },
  {
    path: '/services/aai',
    name: 'AwareAsset',
    component: () => import('../views/AwareAssetInfo.vue'),
    meta: { showNavTop: true, showNavFooter: true }
  },
  {
    path: '/services/abi',
    name: 'AssetBenefit',
    component: () => import('../views/AssetBenefitInfo.vue'),
    meta: { showNavTop: true, showNavFooter: true }
  },
  {
    path: '/services/upi',
    name: 'UpdateInnovation',
    component: () => import('../views/UpdateInnovation.vue'),
    meta: { showNavTop: true, showNavFooter: true }
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
