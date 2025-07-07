<template>
    

  <b-modal
    v-model="internalShow"
    title="צור מתכון חדש"
    @ok="submitRecipe"
    @hide="$emit('update:show', false)"
  >
  <p> {{ internalShow }}</p>
    <form>
      <b-form-group label="שם מתכון">
        <b-form-input v-model="recipe.title" required />
      </b-form-group>

      <b-form-group label="קישור לתמונה">
        <b-form-input v-model="recipe.img" />
      </b-form-group>

      <b-form-group label="זמן הכנה (בדקות)">
        <b-form-input type="number" v-model="recipe.time" />
      </b-form-group>

      <b-form-group label="תיאור קצר">
        <b-form-textarea v-model="recipe.description" rows="2" />
      </b-form-group>

      <b-form-checkbox v-model="recipe.isVegan">טבעוני</b-form-checkbox>
      <b-form-checkbox v-model="recipe.isVegetarian">צמחוני</b-form-checkbox>
      <b-form-checkbox v-model="recipe.isGlutenFree">ללא גלוטן</b-form-checkbox>

      <hr />

      <label>מצרכים:</label>
      <div
        v-for="(item, index) in recipe.ingredients"
        :key="index"
        class="mb-2 d-flex"
      >
        <b-form-input v-model="recipe.ingredients[index]" class="flex-grow-1" />
        <b-button variant="danger" size="sm" @click="removeIngredient(index)">
          X
        </b-button>
      </div>
      <b-button size="sm" @click="addIngredient">הוסף מצרך</b-button>

      <hr />

      <b-form-group label="הוראות הכנה">
        <b-form-textarea v-model="recipe.instructions" rows="5" />
      </b-form-group>
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
        await this.axios.post('/recipes', this.recipe , {withCredentials: true});
        this.$emit('created');
        this.$emit('update:show', false);
      } catch (err) {
        console.error('Failed to save recipe:', err);
      }
    }
  }
};
</script>

