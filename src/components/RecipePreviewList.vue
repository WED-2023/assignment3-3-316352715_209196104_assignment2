<template>
  <div class="container mt-4">
    <h3>{{ title }}</h3>
    <div v-if="recipes.length === 0">No recipes found.</div>
    <div class="row">
      <div v-for="recipe in recipes" :key="recipe.recipe_id" class="col-md-4 mb-4">
        <RecipePreview :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from './RecipePreview.vue';

export default {
  name: 'RecipePreviewList',
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes: {
      type: Array,
      default: () => [],
      required: true
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 300px;
}
</style>
