<template>
  <div class="search-results">
    <div v-if="recipes.length === 0" class="no-results">
      לא נמצאו תוצאות רלוונטיות.
    </div>
    <div v-else class="row">
      <div
        v-for="recipe in sortedRecipes"
        :key="recipe.recipe_id || recipe.id"
        class="col-md-4 mb-4"
      >
        <RecipePreview :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";

export default {
  name: "SearchResults",
  components: { RecipePreview },
  props: {
    recipes: {
      type: Array,
      default: () => [],
      required: true
    },
    sortBy: {
      type: String,
      default: "popularity" // או 'time'
    }
  },
  computed: {
    sortedRecipes() {
      if (this.sortBy === "time") {
        return [...this.recipes].sort((a, b) => a.readyInMinutes - b.readyInMinutes);
      }
      // default: sort by popularity
      return [...this.recipes].sort((a, b) => b.popularity - a.popularity);
    }
  }
};
</script>

<style scoped>
.no-results {
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 2rem;
}
</style>
