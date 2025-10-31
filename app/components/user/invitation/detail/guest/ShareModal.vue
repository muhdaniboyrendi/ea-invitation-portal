<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Bagikan Undangan",
  },
  message: {
    type: String,
    default: "Pilih platform untuk membagikan undangan Anda",
  },
  shareUrl: {
    type: String,
    required: true,
  },
  shareText: {
    type: String,
    default: "Lihat undangan saya!",
  },
  whatsappPhone: {
    type: String,
    default: null,
  },
  guestName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);
const toast = ref({ show: false, message: "" });

const handleClose = () => {
  emit("close");
};

const showToast = (message) => {
  toast.value = { show: true, message };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// Generate personalized greeting based on guest name
const personalizedGreeting = computed(() => {
  if (props.guestName) {
    return `Assalamualaikum Wr. Wb. 🌟

Halo ${props.guestName}! Apa kabar? Semoga selalu sehat dan bahagia ya! 😊

Kami ingin berbagi kabar bahagia nih! Ada moment spesial yang akan segera kami rayakan, dan tentu saja kami sangat berharap kamu bisa hadir untuk merayakan kebahagiaan ini bersama kami! 🎉💕

Semua detail acara sudah kami siapkan di undangan digital khusus untuk kamu. Yuk, langsung cek aja supaya gak ketinggalan info pentingnya! 📱✨

Link undangan:
${props.shareUrl}

Ditunggu kehadirannya ya! Mohon konfirmasi kehadirannya melalui undangan digital di atas. Terima kasih banyak! 🙏💖

Wassalamualaikum Wr. Wb.`;
  }

  return `Assalamualaikum Wr. Wb. 🌟

Halo! Apa kabar? Semoga selalu sehat dan bahagia ya! 😊

Kami ingin berbagi kabar bahagia nih! Ada moment spesial yang akan segera kami rayakan, dan tentunya kami sangat berharap kamu bisa hadir untuk merayakan kebahagiaan ini bersama kami! 🎉💕

Semua detail acara sudah kami siapkan di undangan digital khusus. Yuk, langsung cek aja supaya gak ketinggalan info pentingnya! 📱✨

Link undangan:
${props.shareUrl}

Ditunggu kehadirannya ya! Mohon konfirmasi kehadirannya melalui undangan digital di atas. Terima kasih banyak! 🙏💖

Wassalamualaikum Wr. Wb.`;
});

const shareOptions = computed(() => [
  {
    name: "WhatsApp",
    icon: "bi-whatsapp",
    color: "bg-emerald-500",
    hoverColor: "hover:bg-emerald-600",
    badge: props.whatsappPhone ? "Direct" : null,
    badgeColor: "bg-sky-500",
    action: () => {
      const text = encodeURIComponent(personalizedGreeting.value);
      let whatsappUrl;
      if (props.whatsappPhone) {
        whatsappUrl = `https://wa.me/${props.whatsappPhone}?text=${text}`;
      } else {
        whatsappUrl = `https://wa.me/?text=${text}`;
      }
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    },
  },
  {
    name: "Instagram",
    icon: "bi-instagram",
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
    hoverColor: "hover:from-purple-600 hover:via-pink-600 hover:to-orange-600",
    badge: null,
    action: async () => {
      try {
        await navigator.clipboard.writeText(personalizedGreeting.value);
        showToast(
          "Pesan & link disalin! Buka Instagram dan share manual ya 📱"
        );
      } catch (err) {
        showToast("Buka Instagram dan bagikan link secara manual");
      }
    },
  },
  {
    name: "Telegram",
    icon: "bi-telegram",
    color: "bg-sky-500",
    hoverColor: "hover:bg-sky-600",
    badge: null,
    action: () => {
      const text = encodeURIComponent(personalizedGreeting.value);
      window.open(
        `https://t.me/share/url?url=${props.shareUrl}&text=${text}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
  },
]);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.shareUrl);
    showToast("Link berhasil disalin! 📋✨");
  } catch (err) {
    showToast("Gagal menyalin link");
  }
};

const copyMessageAndLink = async () => {
  try {
    await navigator.clipboard.writeText(personalizedGreeting.value);
    showToast("Pesan & link berhasil disalin! 📋💕");
  } catch (err) {
    showToast("Gagal menyalin pesan");
  }
};

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
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
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
            class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            <!-- Close Button -->
            <button
              @click="handleClose"
              class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <i class="bi-x-lg text-slate-600 dark:text-slate-300"></i>
            </button>

            <!-- Icon Share -->
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 rounded-3xl flex items-center justify-center bg-sky-50 dark:bg-sky-950"
              >
                <i class="bi-send text-3xl text-sky-500"></i>
              </div>
            </div>

            <!-- Title -->
            <h3
              class="text-xl font-bold text-center text-slate-900 dark:text-slate-50 mb-2"
            >
              {{ title }}
            </h3>

            <!-- Description -->
            <p
              class="text-center text-slate-600 dark:text-slate-300 mb-6 text-sm"
            >
              {{ message }}
            </p>

            <!-- Preview Message Section -->
            <div
              class="mb-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              <div class="flex items-center gap-2 mb-3">
                <i
                  class="bi-chat-text text-slate-600 dark:text-slate-400 text-sm"
                ></i>
                <span
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                >
                  Preview Pesan
                </span>
              </div>
              <div
                class="bg-white dark:bg-slate-900 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line max-h-40 overflow-y-auto scrollbar-hide border border-slate-200 dark:border-slate-800"
              >
                {{ personalizedGreeting }}
              </div>
              <button
                @click="copyMessageAndLink"
                class="w-full mt-3 h-10 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <i class="bi-clipboard"></i>
                Salin Pesan Lengkap
              </button>
            </div>

            <!-- Share Options Grid -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <i
                  class="bi-send-fill text-slate-600 dark:text-slate-400 text-sm"
                ></i>
                <span
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                >
                  Pilih Platform
                </span>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="option in shareOptions"
                  :key="option.name"
                  @click="option.action"
                  class="relative w-fit mx-auto flex flex-col items-center gap-2 p-2 transition-all active:scale-95 cursor-pointer"
                >
                  <!-- Badge for WhatsApp Direct -->
                  <span
                    v-if="option.badge"
                    class="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full shadow-md z-10"
                    :class="option.badgeColor"
                  >
                    {{ option.badge }}
                  </span>

                  <span
                    class="w-12 h-12 rounded-2xl flex justify-center items-center transition-colors"
                    :class="[option.color, option.hoverColor]"
                  >
                    <i :class="option.icon" class="text-3xl text-white"></i>
                  </span>
                  <span
                    class="text-xs font-medium text-slate-900 dark:text-slate-50"
                  >
                    {{ option.name }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Copy Link Only Section -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <i
                  class="bi-link-45deg text-slate-600 dark:text-slate-400 text-sm"
                ></i>
                <span
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                >
                  Link Undangan
                </span>
              </div>
              <div
                class="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-600 dark:text-slate-300 truncate border border-slate-200 dark:border-slate-800"
              >
                {{ shareUrl }}
              </div>
              <button
                @click="copyToClipboard"
                class="w-full h-10 bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
              >
                <i class="bi-link-45deg text-lg"></i>
                Salin Link Saja
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="toast.show"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 dark:border-slate-200"
      >
        <i
          class="bi-check-circle-fill text-emerald-400 dark:text-emerald-500"
        ></i>
        <span class="font-semibold text-sm">{{ toast.message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>
