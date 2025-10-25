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
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    hoverColor: "hover:from-green-600 hover:to-emerald-700",
    badge: props.whatsappPhone ? "Direct" : null,
    badgeColor: "bg-blue-500",
    action: () => {
      const text = encodeURIComponent(personalizedGreeting.value);

      let whatsappUrl;
      if (props.whatsappPhone) {
        // Send to specific number with personalized message
        whatsappUrl = `https://wa.me/${props.whatsappPhone}?text=${text}`;
      } else {
        // Open WhatsApp with message only (user can choose recipient)
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
    name: "Facebook",
    icon: "bi-facebook",
    color: "bg-gradient-to-br from-blue-600 to-blue-700",
    hoverColor: "hover:from-blue-700 hover:to-blue-800",
    badge: null,
    action: () => {
      const url = encodeURIComponent(props.shareUrl);
      const quote = encodeURIComponent(
        props.guestName
          ? `Undangan spesial untuk ${props.guestName}! 🎉`
          : "Undangan spesial untukmu! 🎉"
      );
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
  },
  {
    name: "Twitter",
    icon: "bi-twitter-x",
    color: "bg-gradient-to-br from-gray-800 to-black",
    hoverColor: "hover:from-gray-900 hover:to-gray-950",
    badge: null,
    action: () => {
      const text = encodeURIComponent(
        `🎉 Undangan Spesial! 💕\n\nAda moment bahagia yang ingin kami bagikan! Yuk cek undangan digitalnya! ✨`
      );
      const url = encodeURIComponent(props.shareUrl);
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
  },
  {
    name: "Telegram",
    icon: "bi-telegram",
    color: "bg-gradient-to-br from-sky-500 to-blue-600",
    hoverColor: "hover:from-sky-600 hover:to-blue-700",
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
  {
    name: "Email",
    icon: "bi-envelope-fill",
    color: "bg-gradient-to-br from-red-500 to-rose-600",
    hoverColor: "hover:from-red-600 hover:to-rose-700",
    badge: null,
    action: () => {
      const subject = encodeURIComponent(
        props.guestName
          ? `🎉 Undangan Spesial untuk ${props.guestName}`
          : "🎉 Undangan Spesial Untukmu"
      );
      const body = encodeURIComponent(personalizedGreeting.value);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
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
            class="relative bg-white dark:bg-dark border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            <!-- Close Button -->
            <button
              @click="handleClose"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10"
            >
              <i class="bi-x-lg text-dark dark:text-white"></i>
            </button>

            <!-- Icon Share -->
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
              >
                <i
                  class="bi-send text-3xl text-blue-600 dark:text-blue-400"
                ></i>
              </div>
            </div>

            <!-- Title -->
            <h3
              class="text-xl font-bold text-center text-dark dark:text-white mb-2"
            >
              {{ title }}
            </h3>

            <!-- Description -->
            <p
              class="text-center text-black/70 dark:text-white/70 mb-6 text-sm"
            >
              {{ message }}
            </p>

            <!-- Preview Message Section -->
            <div
              class="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/30"
            >
              <div class="flex items-center gap-2 mb-3">
                <span class="text-sm font-semibold text-dark dark:text-white"
                  >Preview Pesan</span
                >
              </div>
              <div
                class="bg-white dark:bg-dark/50 rounded-xl p-3 text-xs text-dark dark:text-white/80 whitespace-pre-line max-h-40 overflow-y-auto scrollbar-hide border border-black/5 dark:border-white/5"
              >
                {{ personalizedGreeting }}
              </div>
              <button
                @click="copyMessageAndLink"
                class="w-full mt-3 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <i class="bi-clipboard"></i>
                Salin Pesan Lengkap
              </button>
            </div>

            <!-- Share Options Grid -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <i class="bi-send-fill text-gray-600 dark:text-gray-400"></i>
                <span class="text-sm font-semibold text-dark dark:text-white"
                  >Pilih Platform</span
                >
              </div>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="option in shareOptions"
                  :key="option.name"
                  @click="option.action"
                  class="relative flex flex-col items-center gap-2 p-3 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <!-- Badge for WhatsApp Direct -->
                  <span
                    v-if="option.badge"
                    class="absolute top-1 right-4 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-full shadow-md"
                    :class="option.badgeColor"
                  >
                    {{ option.badge }}
                  </span>

                  <span
                    class="h-12 aspect-square rounded-2xl flex justify-center items-center"
                    :class="[option.color, option.hoverColor]"
                  >
                    <i :class="option.icon" class="text-3xl text-white"></i>
                  </span>
                  <span class="text-xs font-medium text-dark dark:text-white">{{
                    option.name
                  }}</span>
                </button>
              </div>
            </div>

            <!-- Copy Link Only Section -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi-link-45deg text-gray-600 dark:text-gray-400"></i>
                <span class="text-sm font-semibold text-dark dark:text-white"
                  >Link Undangan</span
                >
              </div>
              <div class="flex items-center gap-2">
                <div
                  class="flex-1 px-4 py-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-xs text-dark dark:text-white truncate border border-black/5 dark:border-white/5"
                >
                  {{ shareUrl }}
                </div>
              </div>
              <button
                @click="copyToClipboard"
                class="w-full px-4 py-2.5 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg"
              >
                <i class="bi-link-45deg"></i>
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
        class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] px-6 py-3 bg-dark dark:bg-white text-white dark:text-dark rounded-full shadow-2xl flex items-center gap-2"
      >
        <i class="bi-check-circle-fill text-green-400"></i>
        <span class="font-medium">{{ toast.message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>
