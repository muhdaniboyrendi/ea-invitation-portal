<script setup>
const props = defineProps({
  type: {
    type: String,
    validator: (value) =>
      ["success", "error", "warning", "info"].includes(value),
    default: "info",
  },
  message: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const alertConfig = computed(() => {
  const configs = {
    success: {
      bgClass: "bg-green-100 dark:bg-green-950",
      borderClass: "border-green-600 dark:border-green-500",
      textClass: "text-green-600 dark:text-green-500",
      icon: "bi-check-circle-fill",
    },
    error: {
      bgClass: "bg-red-100 dark:bg-red-950",
      borderClass: "border-red-600 dark:border-red-500",
      textClass: "text-red-600 dark:text-red-500",
      icon: "bi-exclamation-triangle-fill",
    },
    warning: {
      bgClass: "bg-yellow-100 dark:bg-yellow-950",
      borderClass: "border-yellow-600 dark:border-yellow-500",
      textClass: "text-yellow-600 dark:text-yellow-500",
      icon: "bi-exclamation-circle-fill",
    },
    info: {
      bgClass: "bg-blue-100 dark:bg-blue-950",
      borderClass: "border-blue-600 dark:border-blue-500",
      textClass: "text-blue-600 dark:text-blue-500",
      icon: "bi-info-circle-fill",
    },
  };
  return configs[props.type] || configs.info;
});
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="w-full rounded-2xl p-6 border font-medium mb-6 flex items-center gap-3"
      :class="[
        alertConfig.bgClass,
        alertConfig.borderClass,
        alertConfig.textClass,
      ]"
    >
      <i :class="alertConfig.icon" class="text-lg" />
      <p>{{ message }}</p>
    </div>
  </Transition>
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
