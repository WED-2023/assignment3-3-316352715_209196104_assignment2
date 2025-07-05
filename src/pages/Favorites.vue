<template>
  <div class="container mt-4">
    <h1>Favorite Recipes</h1>

    <div v-if="recipes.length === 0">No favorite recipes to display</div>

    <RecipePreview
      v-for="r in recipes"
      :key="r.recipe_id || r.id"
      :recipe="r"
      :favorites="favoriteIds"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import RecipePreview from '@/components/RecipePreview.vue';

export default defineComponent({
  name: "FavoriteRecipesPage",
  components: { RecipePreview },
  setup() {
    const recipes = ref([]);
    const favoriteIds = ref([]);

    const loadFavorites = async () => {
      try {
        const { data: ids } = await axios.get('/users/favorites', { withCredentials: true });
        favoriteIds.value = ids;

        const recipeResponses = await Promise.all(
          ids.map(id => axios.get(`/recipes/${id}`, { withCredentials: true }))
        );

        recipes.value = recipeResponses.map(res => res.data);
      } catch (err) {
        console.error('Error loading favorite recipes:', err);
      }
    };

    onMounted(() => {
      loadFavorites();
    });

    return {
      recipes,
      favoriteIds
    };
  }
});
</script>
