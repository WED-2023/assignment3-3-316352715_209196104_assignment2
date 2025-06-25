<template>
  <div id="app">
    <div v-if="checkedLogin">
      <div id="nav">
        <router-link :to="{ name: 'main' }">Vue Recipes</router-link> |
        <router-link :to="{ name: 'search' }">Search</router-link> |
        <router-link :to="{ name: 'family-recipes' }">Family Recipes</router-link> |
        <router-link :to="{ name: 'create-recipe' }">Add a recipe</router-link> |

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

    <!-- מסך טעינה זמני -->
    <div v-else class="loading-screen">
      <p>Checking login status...</p>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, computed, onMounted, ref } from 'vue';
import axios from 'axios';

export default {
  name: "App",
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;

    const checkedLogin = ref(false);

const logout = async () => {
  try {
    await axios.post('/auth/logout', {}, { withCredentials: true });
  } catch (err) {
    console.error("Logout request failed:", err);
  }

  store.logout();
  toast("Logout", "User logged out successfully", "success");
  router.push("/").catch(() => {});
};

    const username = computed(() => store?.username);

    onMounted(async () => {
      try {
        const res = await axios.get('/users/me', { withCredentials: true });
        if (res.status === 200 && res.data?.username) {
          store.login(res.data.username);
        } else {
          store.logout();
        }
      } catch {
        store.logout();
      } finally {
        checkedLogin.value = true;
      }
    });

    return { store, username, logout, checkedLogin };
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
  padding: 20px 30px;
  background-color: #ffffff;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}


#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.loading-screen {
  padding: 50px;
  text-align: center;
  font-size: 1.2em;
  color: #888;
}
</style>
