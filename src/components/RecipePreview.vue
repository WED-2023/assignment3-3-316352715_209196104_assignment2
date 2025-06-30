<template>
  <div
    class="card recipe-card"
    :class="{ viewed: hasBeenViewed }"
    @click="goToRecipe"
  >
    <img
      :src="recipe.image"
      alt="Recipe image"
      class="card-img-top recipe-image"
    />

    <div class="card-body text-center">
      <h5 class="card-title">{{ formattedName }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      <p class="card-text">{{ recipe.popularity }} likes</p>

      <BaseButton type="outline" @click.stop="toggleFavorite">
                      <i
                :class="[
                  liked ? 'fas fa-heart text-danger' : 'far fa-heart'
                ]"
              ></i>
      </BaseButton>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BaseButton from '@/components/BaseButton.vue';

export default {
  name: "RecipePreview",
  components: {
    BaseButton
  },
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      liked: false
    };
  },
  computed: {
    hasBeenViewed() {
      const id = this.recipe.recipe_id || this.recipe.id;
      return sessionStorage.getItem(`viewed_${id}`) === 'true';
    },
    formattedName() {
      if (!this.recipe.title) return '';
      return this.recipe.title
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  },
  async mounted() {
    try {
      const response = await axios.get('/users/favorites');
      const favs = response.data.map(r => r.recipe_id || r.id);
      this.liked = favs.includes(this.recipe.recipe_id || this.recipe.id);
    } catch (err) {
      // אפשר להתעלם פה בשקט – אם המשתמש לא מחובר זה לא קריטי
    }
  },
  methods: {
    goToRecipe() {
      const id = this.recipe.recipe_id || this.recipe.id;

      sessionStorage.setItem(`viewed_${id}`, 'true');
      this.$router.push({
        name: "recipe",
        params: { recipeId: id }
      });
    },
    async toggleFavorite() {
      const recipeId = this.recipe.recipe_id || this.recipe.id;
      console.log('Sending recipeId:', recipeId);

      try {
        const response = await axios.post('/users/favorites', { recipeId });
        this.liked = true;
        console.log(response.data.message);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("You must be logged in to add favorites.");
        } else if (error.response && error.response.status === 409) {
          alert("This recipe is already in your favorites.");
        } else {
          console.error("Failed to toggle favorite:", error);
          alert("Something went wrong. Try again later.");
        }
      }
    }
  }
};
</script>
