<template>
  <div class="container">
    <RecipeView :recipe-id="$route.params.recipeId" />
  </div>
</template>

<script>
import RecipeView from '@/components/RecipeView.vue';

export default {
  name: 'RecipeViewPage',
  components: {
    RecipeView
  }
};
</script>
