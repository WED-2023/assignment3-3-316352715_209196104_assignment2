import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

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
  },
  {
    path: '/recipes/create',
    name: 'create-recipe',
    component: () => import('@/pages/CreateRecipeModalPage.vue') 
  }

];


export default routes;
