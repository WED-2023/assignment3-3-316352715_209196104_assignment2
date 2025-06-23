import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';



const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/recipes/:recipeId",
    name: "recipe",
    component: () => import("@/pages/RecipeViewPage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  },
  {
    path: '/recipes/family-recipes',
    name: 'family-recipes',
    component: () => import('@/pages/FamilyRecipesPage.vue')
  }

];


const router = createRouter({
    history: createWebHistory(), 
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    try {
      const res = await axios.get('/users/me');
      if (res.status === 200 && res.data?.username) {
        return next('/'); 
      }
    } catch (err) {
        // ignore if not logged in

    }
  }

  next(); 
});


export default router;
