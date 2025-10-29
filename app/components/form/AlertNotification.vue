<!-- FormAlertNotification.vue -->
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
  duration: {
    type: Number,
    default: 5000,
  },
  position: {
    type: String,
    validator: (value) =>
      [
        "top-right",
        "top-left",
        "top-center",
        "bottom-right",
        "bottom-left",
        "bottom-center",
      ].includes(value),
    default: "top-right",
  },
});

const emit = defineEmits(["close"]);

const alertConfig = computed(() => {
  const configs = {
    success: {
      bgClass: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      borderClass: "border-emerald-400",
      textClass: "text-white",
      icon: "bi-check-circle-fill",
      iconBg: "bg-white/20",
    },
    error: {
      bgClass: "bg-gradient-to-r from-red-500 to-red-600",
      borderClass: "border-red-400",
      textClass: "text-white",
      icon: "bi-exclamation-triangle-fill",
      iconBg: "bg-white/20",
    },
    warning: {
      bgClass: "bg-gradient-to-r from-amber-500 to-amber-600",
      borderClass: "border-amber-400",
      textClass: "text-white",
      icon: "bi-exclamation-circle-fill",
      iconBg: "bg-white/20",
    },
    info: {
      bgClass: "bg-gradient-to-r from-sky-500 to-sky-600",
      borderClass: "border-sky-400",
      textClass: "text-white",
      icon: "bi-info-circle-fill",
      iconBg: "bg-white/20",
    },
  };
  return configs[props.type] || configs.info;
});

const positionClasses = computed(() => {
  const positions = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "top-center": "top-6 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  };
  return positions[props.position] || positions["top-right"];
});

const handleClose = () => {
  emit("close");
};

// Auto close after duration
let autoCloseTimer = null;
watch(
  () => props.show,
  (newValue) => {
    if (newValue && props.duration > 0) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = setTimeout(() => {
        handleClose();
      }, props.duration);
    } else {
      clearTimeout(autoCloseTimer);
    }
  }
);

onUnmounted(() => {
  clearTimeout(autoCloseTimer);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-90 translate-y-[-20px]"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-90 translate-y-[-20px]"
    >
      <div
        v-if="show"
        class="fixed z-[9999] max-w-md w-full pointer-events-auto"
        :class="positionClasses"
      >
        <div
          class="relative rounded-2xl shadow-2xl backdrop-blur-sm border overflow-hidden"
          :class="[alertConfig.bgClass, alertConfig.borderClass]"
        >
          <!-- Progress Bar -->
          <div
            v-if="duration > 0"
            class="absolute top-0 left-0 h-1 bg-white/30 animate-progress"
            :style="{ animationDuration: `${duration}ms` }"
          />

          <!-- Content -->
          <div class="p-4 flex items-center gap-4">
            <!-- Icon -->
            <div
              class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              :class="alertConfig.iconBg"
            >
              <i
                :class="[alertConfig.icon, alertConfig.textClass]"
                class="text-xl"
              />
            </div>

            <!-- Message -->
            <div class="flex-1">
              <p
                class="font-medium leading-relaxed"
                :class="alertConfig.textClass"
              >
                {{ message }}
              </p>
            </div>

            <!-- Close Button -->
            <button
              @click="handleClose"
              class="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center group"
              :class="alertConfig.textClass"
            >
              <i
                class="bi bi-x-lg text-lg group-hover:scale-110 transition-transform"
              />
            </button>
          </div>

          <!-- Decorative Elements -->
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          />
          <div
            class="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-progress {
  animation: progress linear forwards;
}
</style>
