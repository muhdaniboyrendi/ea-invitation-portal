<!-- FormBaseInput.vue -->
<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: "text",
  },
  required: Boolean,
  error: String,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue", "input", "blur"]);

const handleInput = (e) => {
  emit("update:modelValue", e.target.value);
  emit("input", e);
};
</script>

<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @blur="emit('blur', $event)"
      class="w-full px-4 py-3 bg-white dark:bg-slate-800 dark:text-slate-50 border-2 rounded-2xl focus:outline-none transition-colors"
      :class="
        error
          ? 'border-red-500 focus:border-red-500'
          : 'border-slate-200 dark:border-slate-700 focus:border-sky-500 dark:focus:border-sky-400'
      "
    />
    <Transition name="fade">
      <p v-if="error" class="text-red-500 text-sm mt-1 flex items-center gap-1">
        <i class="bi bi-exclamation-circle" />
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
