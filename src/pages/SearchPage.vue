<template>
  <div class="container py-4">
    <h2 class="mb-3 fw-bold text-primary text-start">Search Recipes</h2>

    <!-- ───────────── Search Form ───────────── -->
    <form @submit.prevent="search" class="mb-4">
      <div class="row g-4">
        <!-- Recipe Name -->
        <div class="col-md-4">
          <label class="form-label">Recipe Name</label>
          <input
            v-model="query"
            type="text"
            class="form-control"
            placeholder="Search by name..."
          />
        </div>

        <!-- Results Count -->
        <div class="col-md-2">
          <label class="form-label">Results</label>
          <select v-model="number" class="form-select">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
          </select>
        </div>

        <!-- Cuisine -->
        <div class="col-md-2">
          <label class="form-label">Cuisine</label>
          <select v-model="cuisine" class="form-select">
            <option value="">Any</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="chinese">Chinese</option>
          </select>
        </div>

        <!-- Diet -->
        <div class="col-md-2">
          <label class="form-label">Diet</label>
          <select v-model="diet" class="form-select">
            <option value="">Any</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="gluten free">Gluten‑Free</option>
          </select>
        </div>

        <!-- Sort -->
        <div class="col-md-2">
          <label class="form-label">Sort by</label>
          <select v-model="sort" class="form-select">
            <option value="">None</option>
            <option value="popularity">Popularity</option>
            <option value="time">Prep Time</option>
          </select>
        </div>

        <!-- Submit -->
        <div class="col-12 text-end mt-2">
          <button type="submit" class="btn btn-outline-success px-4 py-2 fs-5 fw-bold">
            <i class="fas fa-search me-2"></i> Search
          </button>
        </div>
      </div>
    </form>

    <!-- ───────────── Results ───────────── -->
    <RecipePreviewList
      v-if="results.length"
      :recipes="results"
      :favorites="favorites"
      :viewed-ids="viewedIds"
      :sort-by="sort"
      title="Search Results"
      @favorite-toggled="handleFavoriteToggle"
    />

    <div v-else-if="hasSearched" class="text-center text-muted mt-5">
      <p>No results found.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import RecipePreviewList from '@/components/RecipePreviewList.vue';

export default {
  name: 'SearchResultsPage',
  components: { RecipePreviewList },
  data() {
    return {
      query: '',
      number: 5,
      cuisine: '',
      diet: '',
      sort: '',
      results: [],
      hasSearched: false,
      favorites: [],
      viewedIds: []
    };
  },
  methods: {
    async search() {
      try {
        const params = {
          name: this.query,
          limit: this.number,
          cuisine: this.cuisine,
          diet: this.diet,
          sortBy: this.sort === 'time' ? undefined : this.sort,
          order: 'desc'
        };

        this.results = [];
        const { data } = await axios.get('/recipes/', { params });
        this.results = data;
        this.hasSearched = true;

        localStorage.setItem('lastSearch', JSON.stringify(params));
      } catch (err) {
        console.error('Search failed:', err);
        this.results = [];
        this.hasSearched = true;
      }
    },
    handleFavoriteToggle({ id, liked }) {
      const strId = String(id);
      if (liked && !this.favorites.includes(strId)) {
        this.favorites.push(strId);
      } else if (!liked && this.favorites.includes(strId)) {
        this.favorites = this.favorites.filter(f => f !== strId);
      }
    }
  },
  async mounted() {
    // Restore last search (if any)
    const last = localStorage.getItem('lastSearch');
    if (last) {
      Object.assign(this.$data, JSON.parse(last));
      this.search();
    }

    // Load favorites + viewed IDs (if logged in)
    try {
      const favRes = await axios.get('/users/favorites', { withCredentials: true });
      this.favorites = favRes.data.map(f => String(f.recipe_id || f.id));

      const viewedRes = await axios.get('/recipes/viewed/ids', { withCredentials: true });
      this.viewedIds = viewedRes.data.map(String);
    } catch (err) {
      console.warn('Could not load favorites/viewed IDs:', err);
    }
  }
};
</script>

<style scoped>
input.form-control,
select.form-select {
  text-align: left;
}
</style>
