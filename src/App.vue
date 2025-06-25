<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'main' }">Main Menu</router-link> |
      <router-link :to="{ name: 'search' }">Search</router-link> |
      <router-link :to="{name: 'family-recipes'}">Family Recipes</router-link> | 
      <router-link :to="{name: 'create-recipe'}">Add a Recipe</router-link>  |
      <router-link :to="{name: 'about'}">About</router-link>  |
      
      <span v-if="!store?.username">
          Guest:
        <router-link :to="{ name: 'register' }">Register</router-link> |
        <router-link :to="{ name: 'login' }">Login</router-link> |
      </span>
      <span v-else>
        {{ store.username }}:
        <button @click="logout" class="btn btn-link p-0">Logout</button> |
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getCurrentInstance, computed } from 'vue';

export default {
  name: "App",
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;

    const logout = () => {
      store.logout();
      toast("Logout", "User logged out successfully", "success");
      router.push("/").catch(() => {});
    };

    const username = computed(() => store?.username);

    return { store, username, logout }; 
  }
}
</script>


<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  padding-top: 80px; 
}
#nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: #ffffff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-family: 'Segoe UI', sans-serif;
  z-index: 999;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

#nav a.router-link-exact-active {
  background-color: #e76f51;
  color: white;
}

#nav a:hover {
  background-color: #f2f2f2;
}


#nav span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

</style>
