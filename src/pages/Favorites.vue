<template>
  <div class="container mt-4">
    <h1>Favorite Recipes</h1>

    <div v-if="recipes.length === 0">No favorite recipes to display</div>

    <RecipePreview
      v-for="r in recipes"
      :key="r.recipe_id || r.id"
      :recipe="r"
      :favorites="favoriteIds.map(f => String(f.recipe_id || f.id))"
      @favorite-toggled="handleFavoriteToggle"
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
          ids.map(({ id, recipe_id }) =>
            axios.get(`/recipes/${recipe_id || id}`, { withCredentials: true })
          )
        );

        recipes.value = recipeResponses.map(res => res.data);
      } catch (err) {
        console.error('Error loading favorite recipes:', err);
      }
    };

    const handleFavoriteToggle = ({ id, liked }) => {
      const strId = String(id);

      if (liked && !favoriteIds.value.includes(strId)) {
        favoriteIds.value.push(strId);
      } else if (!liked && favoriteIds.value.includes(strId)) {
        favoriteIds.value = favoriteIds.value.filter(f => f !== strId);
        recipes.value = recipes.value.filter(r =>
          String(r.recipe_id || r.id) !== strId
        );
      }
    };

    onMounted(() => {
      loadFavorites();
    });

    return {
      recipes,
      favoriteIds,
      handleFavoriteToggle
    };
  }
});
</script>
