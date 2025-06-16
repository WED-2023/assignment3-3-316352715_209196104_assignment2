<template>
    <div class="card mb-4">
        <img :src="recipe.img" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">{{ recipe.title }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">By {{ recipe.originator }} (via {{ recipe.passed_down_by }})</h6>
            <p class="card-text"><strong>Occasion:</strong> {{ recipe.occasion }}</p>
            <p class="card-text"><strong>Description:</strong> {{ recipe.description }}</p>
            <p class="card-text"><em>{{ recipe.story }}</em></p>

        </div>
    </div>
</template>
<script>

import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        recipe:{
            type: Object,
            required: true
        }
    }
})
</script>
