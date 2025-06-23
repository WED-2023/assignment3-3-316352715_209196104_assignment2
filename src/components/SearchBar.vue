<template>
  <div class="search-bar">
    <form @submit.prevent="emitSearch">
      <div class="form-group">
        <input
          v-model="query"
          type="text"
          placeholder="Search recipes..."
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="limit">Results Limit:</label>
        <select v-model="limit" id="limit" class="form-control">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
        </select>
      </div>

      <div class="form-group">
        <label for="cuisine">Cuisine:</label>
        <select v-model="filters.cuisine" id="cuisine" class="form-control">
          <option value="">-- None --</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
          <option value="chinese">Chinese</option>
          <!-- Add more cuisines if needed -->
        </select>
      </div>

      <div class="form-group">
        <label for="diet">Diet:</label>
        <select v-model="filters.diet" id="diet" class="form-control">
          <option value="">-- None --</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten free">Gluten Free</option>
        </select>
      </div>

      <div class="form-group">
        <label for="intolerance">Intolerances:</label>
        <select v-model="filters.intolerance" id="intolerance" class="form-control">
          <option value="">-- None --</option>
          <option value="gluten">Gluten</option>
          <option value="dairy">Dairy</option>
          <option value="egg">Egg</option>
        </select>
      </div>

      <button class="btn btn-primary w-100 mt-2" type="submit">Search</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      query: '',
      limit: 5,
      filters: {
        cuisine: '',
        diet: '',
        intolerance: ''
      }
    };
  },
  methods: {
    emitSearch() {
      this.$emit('search', {
        query: this.query,
        limit: this.limit,
        ...this.filters
      });
    }
  }
};
</script>

<style scoped>
.search-bar {
  padding: 1rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 1rem;
}
</style>
