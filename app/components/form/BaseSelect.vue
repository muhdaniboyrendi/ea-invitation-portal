<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Pilih opsi",
  },
  options: {
    type: Array,
    required: true,
  },
  optionValue: {
    type: String,
    default: "id",
  },
  optionLabel: {
    type: String,
    default: "name",
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const handleChange = (event) => {
  emit("update:modelValue", event.target.value);
  emit("change", event.target.value);
};
</script>

<template>
  <div>
    <label
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      @change="handleChange"
      class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl focus:outline-none transition-colors"
      :class="
        error
          ? 'border-red-500 focus:border-red-500'
          : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400'
      "
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option[optionValue]"
        :value="option[optionValue].toString()"
      >
        {{ option[optionLabel] }}
      </option>
    </select>
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
