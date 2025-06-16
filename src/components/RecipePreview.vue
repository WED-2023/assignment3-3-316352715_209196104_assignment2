<template>
  <div class="card h-100">
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
  }
};
</script>

<style scoped>
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
