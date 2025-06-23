<template>
  <div class="container py-4">
    <h2 class="mb-3">חיפוש מתכונים</h2>

    <form @submit.prevent="search" class="mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label">שם מתכון</label>
          <input v-model="query" type="text" class="form-control" placeholder="חפש לפי שם..." />
        </div>

        <div class="col-md-2">
          <label class="form-label">כמות תוצאות</label>
          <select v-model="number" class="form-select">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">סוג מטבח</label>
          <select v-model="cuisine" class="form-select">
            <option value="">ללא סינון</option>
            <option value="italian">איטלקי</option>
            <option value="mexican">מקסיקני</option>
            <option value="chinese">סיני</option>
            <!-- אפשר להוסיף עוד -->
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">דיאטה</label>
          <select v-model="diet" class="form-select">
            <option value="">ללא סינון</option>
            <option value="vegan">טבעוני</option>
            <option value="vegetarian">צמחוני</option>
            <option value="gluten free">ללא גלוטן</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">מיין לפי</label>
          <select v-model="sort" class="form-select">
            <option value="">ללא מיון</option>
            <option value="popularity">פופולריות</option>
            <option value="time">זמן הכנה</option>
          </select>
        </div>

        <div class="col-12 text-end">
          <button type="submit" class="btn btn-primary">חפש</button>
        </div>
      </div>
    </form>

    <RecipePreviewList v-if="results.length" :recipes="results" title="תוצאות חיפוש" />
    <div v-else-if="hasSearched" class="text-center text-muted mt-5">
      <p>לא נמצאו תוצאות.</p>
    </div>
  </div>
</template>

<script>
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
      hasSearched: false
    };
  },
  methods: {
    async search() {
      try {
        const params = {
          query: this.query,
          number: this.number,
          cuisine: this.cuisine,
          diet: this.diet,
          sort: this.sort
        };
        const { data } = await this.axios.get('/recipes/', { params });
        this.results = data;
        this.hasSearched = true;
        localStorage.setItem('lastSearch', JSON.stringify(params));
      } catch (err) {
        console.error('Search failed:', err);
        this.results = [];
        this.hasSearched = true;
      }
    }
  },
  mounted() {
    const last = localStorage.getItem('lastSearch');
    if (last) {
      Object.assign(this.$data, JSON.parse(last));
      this.search();
    }
  }
};
</script>

<style scoped>
input.form-control,
select.form-select {
  direction: rtl;
}
</style>