<template>
    <div class="form-section collapsible-section">
        <h4 class="collapsible-header" @click="$emit('toggle-section', sectionKey)">
            <i :class="iconClass"></i>
            {{ title }}
            <span class="optional-badge">Opcional</span>
            <i class="bi toggle-icon" :class="isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </h4>

        <div v-if="isExpanded" class="collapsible-content">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({
    sectionKey: String,
    title: String,
    iconClass: String,
    isExpanded: Boolean
});

defineEmits(['toggle-section']);
</script>

<style scoped>
@import url('../../../../css/CreateBikeModal.css');
</style>