<template>
  <div class="card h-100 hover-shadow recipe-card" @click="goToRecipe">
    <img
      v-if="recipe.img"
      :src="recipe.img"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />
    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.name }}</h5>
      <p class="card-text">{{ recipe.time }} minutes</p>
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
      this.$router.push({ name: 'recipe', params: { recipeId: this.recipe.recipe_id } });
    }
  }
};
</script>

<style>
.recipe-card {
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  border-radius: 10px;
}
.recipe-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>

