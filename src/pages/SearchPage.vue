<template>
  <div class="container py-4">
    <h2 class="mb-3 text-end fw-bold text-primary">חיפוש מתכונים</h2>

    <form @submit.prevent="search" class="mb-4">
      <div class="row g-4">
        <div class="col-md-4 text-end">
          <label class="form-label">שם מתכון</label>
          <input
            v-model="query"
            type="text"
            class="form-control"
            placeholder="חפש לפי שם..."
            dir="rtl"
          />
        </div>

        <div class="col-md-2 text-end">
          <label class="form-label">כמות תוצאות</label>
          <select v-model="number" class="form-select" dir="rtl">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
          </select>
        </div>

        <div class="col-md-2 text-end">
          <label class="form-label">סוג מטבח</label>
          <select v-model="cuisine" class="form-select" dir="rtl">
            <option value="">ללא סינון</option>
            <option value="italian">איטלקי</option>
            <option value="mexican">מקסיקני</option>
            <option value="chinese">סיני</option>
          </select>
        </div>

        <div class="col-md-2 text-end">
          <label class="form-label">דיאטה</label>
          <select v-model="diet" class="form-select" dir="rtl">
            <option value="">ללא סינון</option>
            <option value="vegan">טבעוני</option>
            <option value="vegetarian">צמחוני</option>
            <option value="gluten free">ללא גלוטן</option>
          </select>
        </div>

        <div class="col-md-2 text-end">
          <label class="form-label">מיין לפי</label>
          <select v-model="sort" class="form-select" dir="rtl">
            <option value="">ללא מיון</option>
            <option value="popularity">פופולריות</option>
            <option value="time">זמן הכנה</option>
          </select>
        </div>

        <div class="col-12 text-end mt-2">
          <button type="submit" class="btn btn-outline-success px-4 py-2 fs-5 fw-bold">
            <i class="fas fa-search ms-2"></i> חפש
          </button>
        </div>
      </div>
    </form>

    <RecipePreviewList
      v-if="results.length"
      :recipes="results"
      :favorites="favorites"
      :viewed-ids="viewedIds"
      :sort-by="sort"
      title="תוצאות חיפוש"
      @favorite-toggled="handleFavoriteToggle"
    />

    <div v-else-if="hasSearched" class="text-center text-muted mt-5">
      <p>לא נמצאו תוצאות.</p>
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
          order: 'desc',
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
    const last = localStorage.getItem('lastSearch');
    if (last) {
      Object.assign(this.$data, JSON.parse(last));
      this.search();
    }

    try {
      const res1 = await axios.get('/users/favorites', { withCredentials: true });
      this.favorites = res1.data.map(f => String(f.recipe_id || f.id));

      const res2 = await axios.get('/recipes/viewed/ids', { withCredentials: true });
      this.viewedIds = res2.data.map(String);
    } catch (err) {
      console.warn('Failed to load favorites/viewed:', err);
    }
  }
};
</script>

<style scoped>
input.form-control,
select.form-select {
  text-align: right;
}
</style>
