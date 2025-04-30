import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },

  {
    path: "/register/crew",
    name: "crewRegister",
    component: () => import("@/views/CrewRegistrationView.vue"),
    props: (route) => ({ token: route.query.token }),
  },
  {
    path: "/admin/game-management",
    name: "adminGameManagement",
    component: () => import("@/views/AdminGameManagementView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/debug-token",
    name: "debugToken",
    component: () => import("@/views/TokenDebugView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" });
  } else if (requiresAdmin && !authStore.isAdmin) {
    next({ name: "home" });
  } else if (
    (to.name === "login" || to.name === "register") &&
    authStore.isAuthenticated
  ) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
