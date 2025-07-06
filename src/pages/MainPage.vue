<template>
  <div class="main-container">
    <div class="left-column">
      <h2 class="section-title">Explore These Recipes - </h2>
      <div class="recipe-list">
        <RecipePreview
          v-for="recipe in randomRecipes"
          :key="recipe.recipe_id || recipe.id"
          :recipe="recipe"
          :favorites="favorites"
          @favorite-toggled="handleFavoriteToggle"
        />
      </div>
      <BaseButton type="more" @click="loadMoreRecipes">Show Other Recipes</BaseButton>
    </div>

    <div class="right-column">
      <div v-if="store.username">
        <LastViewed />
        <button class="logout-button" @click="logout">התנתק</button>
      </div>

      <div v-else-if="checkedLogin">
        <div class="auth-box">
          <h2 class="welcome-message">היי! שמחים שבאת – איך נוח לך להתחיל?</h2>
          <LoginPage v-if="!isRegistering" @toggle-auth="toggleAuthMode" />
          <RegisterPage v-else @toggle-auth="toggleAuthMode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted } from 'vue';
import axios from 'axios';
import RecipePreview from '@/components/RecipePreview.vue';
import LoginPage from '@/pages/LoginPage.vue';
import LastViewed from '@/components/LastViewed.vue';
import BaseButton from '@/components/BaseButton.vue';
import RegisterPage from '@/pages/RegisterPage.vue';

export default {
  components: {
    BaseButton,
    RecipePreview,
    LoginPage,
    RegisterPage,
    LastViewed
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    const randomRecipes = ref([]);
    const favorites = ref([]);
    const checkedLogin = ref(false);
    const isRegistering = ref(false);

    const toggleAuthMode = () => {
      isRegistering.value = !isRegistering.value;
    };

    const logout = async () => {
      try {
        await axios.post('/auth/logout', {}, { withCredentials: true });
        store.logout();
        window.location.reload();
      } catch (err) {
        console.error("Logout failed:", err);
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/recipes/random');
        randomRecipes.value = response.data;
      } catch (err) {
        console.error("Failed to fetch random recipes:", err);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/users/favorites', { withCredentials: true });
        favorites.value = response.data.map(f => String(f.recipe_id || f.id));
      } catch (err) {
        console.log("Could not load favorites.");
        favorites.value = [];
      }
    };

    const checkLogin = async () => {
      try {
        const res = await axios.get('/users/me', { withCredentials: true });
        if (res.status === 200 && res.data?.username) {
          store.login(res.data.username);
        }
      } catch (err) {
        console.log("User not logged in");
      } finally {
        checkedLogin.value = true;
      }
    };

    const handleFavoriteToggle = ({ id, liked }) => {
      const strId = String(id);
      if (liked && !favorites.value.includes(strId)) {
        favorites.value.push(strId);
      } else if (!liked && favorites.value.includes(strId)) {
        favorites.value = favorites.value.filter(f => f !== strId);
      }
    };

    const loadMoreRecipes = () => {
      fetchRecipes();
    };

    onMounted(async () => {
      await checkLogin();
      if (store.username) {
        await fetchFavorites();
      }
      await fetchRecipes();
    });

    return {
      randomRecipes,
      favorites,
      store,
      loadMoreRecipes,
      logout,
      checkedLogin,
      isRegistering,
      toggleAuthMode,
      handleFavoriteToggle
    };
  }
};
</script>


<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
}

.left-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.right-column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.recipe-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.section-title {
  text-align: center;
  margin-bottom: 1rem;
}

.logout-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #ef4444;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
.logout-button:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    align-items: center;
  }

  .right-column {
    margin-top: 2rem;
  }
}

.welcome-message {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ef6c57;
  text-align: center;
  margin-bottom: 1.5rem;
  background-color: #fff8f6;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.auth-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
</style>
