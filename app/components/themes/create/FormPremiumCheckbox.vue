<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Status Premium",
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const handleChange = (event) => {
  emit("update:modelValue", event.target.checked);
  emit("change", event.target.checked);
};
</script>

<template>
  <div>
    <label
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
    </label>
    <div
      class="flex items-center justify-center h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl"
    >
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          :checked="modelValue"
          @change="handleChange"
          type="checkbox"
          class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ modelValue ? "Premium" : "Gratis" }}
        </span>
        <i
          :class="
            modelValue
              ? 'bi bi-star-fill text-yellow-500'
              : 'bi bi-star text-gray-400'
          "
          class="text-lg"
        />
      </label>
    </div>
    <Transition name="fade">
      <p
        v-if="error"
        class="text-red-500 text-sm mt-1 flex items-center gap-1"
      >
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