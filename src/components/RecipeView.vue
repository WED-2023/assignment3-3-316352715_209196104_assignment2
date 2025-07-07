<template>
  <div v-if="recipe" class="container py-4">
    <div class="recipe-header text-center mb-4">
      <h2>{{ recipe.title }}</h2>
      <img :src="recipe.image || recipe.img" alt="Recipe image" class="recipe-image" />
    </div>
    <div class="row">
      <div class="col-md-6">
        <h5>Ingredients</h5>
        <ul>
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
            {{ ingredient }}
          </li>``
        </ul>
      </div>
      <div class="col-md-6">
        <h5>Instructions</h5>
        <div v-html="recipe.instructions"></div>
      </div>
    </div>
    <div class="mt-4">
      <p><strong>Preparation Time:</strong> {{ recipe.readyInMinutes }} minutes</p>
      <p><strong>Likes:</strong> {{ recipe.popularity }}</p>
    </div>
  </div>
  <div v-else class="text-center py-5">
    <p>Loading recipe...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RecipeView',
  props: {
    recipeId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      recipe: null
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`/recipes/${this.recipeId}`);
      this.recipe = response.data;
      console.log("the recipe: ",this.recipe);
    } catch (err) {
      console.error('Failed to fetch recipe:', err);
    }
  }
};
</script>

<style scoped>
.recipe-image {
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 1rem;
}
</style>
