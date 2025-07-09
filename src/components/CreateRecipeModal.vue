<template>
  <b-modal
    v-model="internalShow"
    title="צור מתכון חדש"
    @ok="submitRecipe"
    @hide="$emit('update:show', false)"
    size="lg"
    scrollable
    hide-footer
    class="rtl-modal"
  >
    <form class="text-end">
      <b-form-group label="שם מתכון">
        <b-form-input v-model="recipe.title" required />
      </b-form-group>

      <b-form-group label="קישור לתמונה">
        <b-form-input v-model="recipe.img" />
      </b-form-group>

      <b-form-group label="זמן הכנה (בדקות)">
        <b-form-input type="number" v-model="recipe.time" min="1" />
      </b-form-group>

      <b-form-group label="תיאור קצר">
        <b-form-textarea v-model="recipe.description" rows="2" />
      </b-form-group>

      <div class="d-flex flex-wrap gap-3 mb-3">
        <b-form-checkbox v-model="recipe.isVegan">טבעוני</b-form-checkbox>
        <b-form-checkbox v-model="recipe.isVegetarian">צמחוני</b-form-checkbox>
        <b-form-checkbox v-model="recipe.isGlutenFree">ללא גלוטן</b-form-checkbox>
      </div>

      <hr />

      <label class="fw-bold">מצרכים:</label>
      <div
        v-for="(item, index) in recipe.ingredients"
        :key="index"
        class="mb-2 d-flex align-items-center gap-2"
      >
        <b-form-input v-model="recipe.ingredients[index]" class="flex-grow-1" />
        <b-button variant="danger" size="sm" @click.prevent="removeIngredient(index)">
          <i class="fas fa-times"></i>
        </b-button>
      </div>
      <b-button size="sm" variant="outline-primary" class="mb-3" @click.prevent="addIngredient">
        + הוסף מצרך
      </b-button>

      <hr />

      <b-form-group label="הוראות הכנה">
        <b-form-textarea v-model="recipe.instructions" rows="5" />
      </b-form-group>

      <div class="text-end">
        <b-button variant="success" @click="submitRecipe">שמור מתכון</b-button>
        <b-button variant="secondary" @click="internalShow = false" class="ms-2">ביטול</b-button>
      </div>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      recipe: {
        title: '',
        img: '',
        time: 0,
        description: '',
        popularity: 0,
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        ingredients: [''],
        instructions: ''
      }
    };
  },
  computed: {
    internalShow: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit('update:show', value);
      }
    }
  },
  methods: {
    addIngredient() {
      this.recipe.ingredients.push('');
    },
    removeIngredient(index) {
      this.recipe.ingredients.splice(index, 1);
    },
    async submitRecipe() {
      try {
        await this.axios.post('/recipes', this.recipe, { withCredentials: true });
        this.$emit('created');
        this.$emit('update:show', false);
      } catch (err) {
        console.error('Failed to save recipe:', err);
      }
    }
  }
};
</script>

<style scoped>
.rtl-modal .modal-content {
  direction: rtl;
  text-align: right;
}
</style>