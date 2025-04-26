<template>
    <label class="switch">
        <input type="checkbox" :checked="modelValue" @change="handleChange" />
        <span class="slider"></span>
    </label>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: [Boolean, Number],
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
    emit('update:modelValue', event.target.checked)
}
</script>

<style scoped>
.switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    border-radius: 34px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: 0.4s;
}

.slider::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
}

input:checked+.slider {
    background-color: #D63636;
}

input:checked+.slider::before {
    transform: translateX(24px);
}
</style>