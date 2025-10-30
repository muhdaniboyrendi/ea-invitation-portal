<!-- FormBaseTextarea.vue -->
<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  rows: {
    type: [String, Number],
    default: 4,
  },
  required: Boolean,
  error: String,
  disabled: Boolean,
  maxlength: [String, Number],
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
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      @input="handleInput"
      @blur="emit('blur', $event)"
      class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl focus:outline-none transition-colors resize-y"
      :class="
        error
          ? 'border-red-500 focus:border-red-500'
          : 'border-gray-200 dark:border-gray-600 focus:border-sky-500 dark:focus:border-sky-400'
      "
    />
    <div v-if="maxlength" class="flex justify-end mt-1">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ (modelValue || "").length }} / {{ maxlength }}
      </span>
    </div>
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
