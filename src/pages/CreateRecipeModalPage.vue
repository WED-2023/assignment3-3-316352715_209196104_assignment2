<template>
  <div class="container py-4">
    <h2 class="mb-4">יצירת מתכון חדש</h2>

    <b-button variant="success" @click="showModal = true">
      פתח טופס יצירת מתכון
    </b-button>

    <CreateRecipeModal
      :show="showModal"
      @update:show="showModal = $event"
      @created="onRecipeCreated"
    />
    

    <div v-if="successMessage" class="alert alert-success mt-4">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import CreateRecipeModal from '@/components/CreateRecipeModal.vue';

export default {
  components: { CreateRecipeModal },
  data() {
    return {
      showModal: false,
      successMessage: ''
    };
  },
  methods: {
    onRecipeCreated() {
      this.successMessage = 'המתכון נשמר בהצלחה!';
      this.showModal = false;
      setTimeout(() => {
        this.successMessage = '';
      }, 4000);
    }
  }
};
</script>
