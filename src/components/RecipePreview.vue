<template>
  <div
    class="card recipe-card"
    @click="goToRecipe"
  >
    <img
      :src="recipe.image"
      alt="Recipe image"
      class="card-img-top recipe-image"
    />
    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.name }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      <p class="card-text">{{ recipe.popularity }} likes</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToRecipe() {
      const id = this.recipe.recipe_id || this.recipe.id;
      console.log("recipeId:", id);

      this.$router.push({
        name: "recipe",
        params: { recipeId: id }
      });
    }
  }
};
</script>

<style>
.recipe-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 10px;
}

.recipe-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
