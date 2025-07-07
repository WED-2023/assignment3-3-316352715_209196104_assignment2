<template>
  <div class="last-viewed-recipes">
    <h3 class="section-title">Last Viewed Recipes</h3>
    <div v-if="recipes.length > 0" class="recipes-list">
      <RecipePreview
        v-for="recipe in recipes"
        :key="recipe.recipe_id || recipe.id"
        :recipe="recipe"
      />
    </div>
    <div v-else class="no-recipes">
      You haven't viewed any recipes yet.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import RecipePreview from './RecipePreview.vue';

export default {
  name: 'LastViewedRecipes',
  components: { RecipePreview },
  data() {
    return {
      recipes: []
    };
  },
  async mounted() {
    try {
      const response = await axios.get('/recipes/viewed');
      this.recipes = response.data;
    } catch (err) {
      console.error('Failed to fetch last viewed recipes:', err);
    }
  }
};
</script>

<style scoped>
.last-viewed-recipes {
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.section-title {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
}
.recipes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.no-recipes {
  text-align: center;
  color: #777;
}
</style>
