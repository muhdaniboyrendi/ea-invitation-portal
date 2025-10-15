<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Hapus Data?",
  },
  message: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    default: "",
  },
  isDeleting: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "Hapus",
  },
  cancelText: {
    type: String,
    default: "Batal",
  },
  type: {
    type: String,
    validator: (value) => ["danger", "warning", "info"].includes(value),
    default: "danger",
  },
});

const emit = defineEmits(["close", "confirm"]);

const handleClose = () => {
  if (!props.isDeleting) {
    emit("close");
  }
};

const handleConfirm = () => {
  if (!props.isDeleting) {
    emit("confirm");
  }
};

const modalConfig = computed(() => {
  const configs = {
    danger: {
      iconBg:
        "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30",
      icon: "bi-exclamation-triangle-fill",
      iconColor: "text-red-600 dark:text-red-400",
      buttonBg:
        "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-red-300 disabled:to-rose-300",
    },
    warning: {
      iconBg:
        "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30",
      icon: "bi-exclamation-circle-fill",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      buttonBg:
        "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-yellow-300 disabled:to-orange-300",
    },
    info: {
      iconBg:
        "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
      icon: "bi-info-circle-fill",
      iconColor: "text-blue-600 dark:text-blue-400",
      buttonBg:
        "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-blue-300 disabled:to-indigo-300",
    },
  };
  return configs[props.type] || configs.danger;
});

// Prevent body scroll when modal is open
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        @click.self="handleClose"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="show"
            class="relative bg-white dark:bg-dark border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6"
          >
            <!-- Icon Warning -->
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
                :class="modalConfig.iconBg"
              >
                <i
                  class="text-3xl -mt-1"
                  :class="[modalConfig.icon, modalConfig.iconColor]"
                ></i>
              </div>
            </div>

            <!-- Judul Modal -->
            <h3
              class="text-xl font-bold text-center text-dark dark:text-white mb-2"
            >
              {{ title }}
            </h3>

            <!-- Deskripsi -->
            <p class="text-center text-black/70 dark:text-white/70 mb-6">
              {{ message }}
              <span
                v-if="itemName"
                class="font-semibold text-dark dark:text-white"
              >
                {{ itemName }}
              </span>
              <span v-if="itemName">?</span>
            </p>

            <!-- Slot untuk konten tambahan -->
            <div v-if="$slots.default" class="mb-6">
              <slot />
            </div>

            <!-- Tombol Aksi -->
            <div class="flex gap-3">
              <button
                type="button"
                @click="handleClose"
                :disabled="isDeleting"
                class="flex-1 px-4 py-2.5 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-dark dark:text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                @click="handleConfirm"
                :disabled="isDeleting"
                class="flex-1 px-4 py-2.5 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 disabled:cursor-not-allowed shadow-lg"
                :class="modalConfig.buttonBg"
              >
                <span v-if="!isDeleting" class="flex items-center">
                  {{ confirmText }}
                </span>
                <span v-else class="flex items-center gap-2">
                  <Spinner />
                  {{ isDeleting ? "Menghapus..." : confirmText }}
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
