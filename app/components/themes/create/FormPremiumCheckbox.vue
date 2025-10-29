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
      class="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2"
    >
      {{ label }}
    </label>

    <!-- Modern Toggle Card -->
    <div
      class="relative overflow-hidden bg-white dark:bg-slate-800 dark:text-slate-300 border-2 rounded-xl transition-all duration-300"
      :class="[
        modelValue
          ? 'border-sky-400 dark:border-sky-500 shadow-lg shadow-sky-100 dark:shadow-sky-900/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
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
                  ? 'bg-gradient-to-br from-sky-500 to-sky-600 border-sky-500 scale-100'
                  : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 group-hover:border-sky-400 dark:group-hover:border-sky-500',
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
                  ? 'text-sky-700 dark:text-sky-400'
                  : 'text-slate-900 dark:text-slate-50'
              "
            >
              {{ modelValue ? "Premium" : "Basic" }}
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
