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

    <!-- Modern Toggle Card -->
    <div
      class="relative overflow-hidden bg-white dark:bg-gray-800 dark:text-slate-300 border-2 rounded-xl transition-all duration-300"
      :class="[
        modelValue
          ? 'border-purple-400 dark:border-purple-500 shadow-lg shadow-purple-100 dark:shadow-purple-900/20'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-600',
        error ? 'border-red-400 dark:border-red-500' : '',
      ]"
    >
      <!-- Content -->
      <label
        class="relative flex items-center justify-between p-3 cursor-pointer group"
      >
        <div class="flex items-center gap-3 flex-1">
          <!-- Custom Checkbox -->
          <div class="relative">
            <input
              :checked="modelValue"
              @change="handleChange"
              type="checkbox"
              class="sr-only peer"
            />

            <!-- Checkbox Visual -->
            <div
              class="w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center"
              :class="[
                modelValue
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500 scale-100'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 group-hover:border-purple-400 dark:group-hover:border-purple-500',
              ]"
            >
              <Transition
                enter-active-class="transition-all duration-200"
                enter-from-class="scale-0 rotate-45"
                enter-to-class="scale-100 rotate-0"
                leave-active-class="transition-all duration-150"
                leave-from-class="scale-100 rotate-0"
                leave-to-class="scale-0 -rotate-45"
              >
                <i
                  v-if="modelValue"
                  class="bi bi-check-lg text-white text-sm font-bold"
                />
              </Transition>
            </div>
          </div>

          <!-- Text Content -->
          <div class="flex flex-col">
            <span
              class="text-sm font-semibold transition-colors duration-200"
              :class="
                modelValue
                  ? 'text-purple-700 dark:text-purple-400'
                  : 'text-gray-700 dark:text-gray-300'
              "
            >
              {{ modelValue ? "Premium" : "Gratis" }}
            </span>
          </div>
        </div>
      </label>
    </div>

    <!-- Error Message -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="error"
        class="mt-2 flex items-center gap-2 text-red-500 dark:text-red-400 text-sm"
      >
        <i class="bi bi-exclamation-circle-fill" />
        <span>{{ error }}</span>
      </div>
    </Transition>
  </div>
</template>