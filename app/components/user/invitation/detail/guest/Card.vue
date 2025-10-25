<script setup>
const props = defineProps({
  guest: {
    type: Object,
    required: true,
  },
  invitationSlug: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);

const config = useRuntimeConfig();
const appUrl = config.public.appUrl;

const showShareModal = ref(false);
const showActions = ref(false);
const showDeleteConfirm = ref(false);
const copying = ref(false);
const actionsRef = ref(null);

// Format attendance status badge
const getStatusBadge = (status) => {
  const badges = {
    attending: {
      text: "Hadir",
      icon: "bi-check-circle-fill",
      class:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20",
    },
    not_attending: {
      text: "Tidak Hadir",
      icon: "bi-x-circle-fill",
      class:
        "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20",
    },
    pending: {
      text: "Menunggu",
      icon: "bi-clock-fill",
      class:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20",
    },
  };
  return badges[status] || badges.pending;
};

// Generate invitation URL
const invitationUrl = computed(() => {
  return `${appUrl}/${props.invitationSlug}?guest=${props.guest.slug}`;
});

// Generate personalized share text
const shareText = computed(() => {
  return `Halo ${props.guest.name}! 👋

Kami dengan senang hati mengundang Anda untuk hadir di acara spesial kami! 🎉

Mohon konfirmasi kehadiran Anda ya! 🙏`;
});

// Format phone number for WhatsApp with validation
const formattedPhone = computed(() => {
  const phone = props.guest.phone;
  if (!phone) return null;

  let cleaned = phone.replace(/\D/g, "");

  // Validate minimum length
  if (cleaned.length < 10) return null;

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }

  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
});

// Toast notification
const toast = ref({ show: false, message: "", type: "success" });

const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// Handle copy link with loading state
const handleCopyLink = async () => {
  if (copying.value) return;

  copying.value = true;

  try {
    await navigator.clipboard.writeText(invitationUrl.value);
    showToast("Link berhasil disalin! 📋");
    showActions.value = false;
  } catch (err) {
    showToast("Gagal menyalin link", "error");
  } finally {
    // Small delay for better UX
    setTimeout(() => {
      copying.value = false;
    }, 300);
  }
};

// Open share modal
const openShareModal = () => {
  showShareModal.value = true;
  showActions.value = false;
};

// Toggle actions menu
const toggleActions = () => {
  showActions.value = !showActions.value;
};

// Show delete confirmation
const confirmDelete = () => {
  showDeleteConfirm.value = true;
  showActions.value = false;
};

// Handle delete after confirmation
const handleDelete = () => {
  emit("delete", props.guest);
  showDeleteConfirm.value = false;
};

// Keyboard shortcuts
const handleKeydown = (e) => {
  // ESC to close modals/dropdowns
  if (e.key === "Escape") {
    if (showActions.value) {
      showActions.value = false;
    }
    if (showShareModal.value) {
      showShareModal.value = false;
    }
    if (showDeleteConfirm.value) {
      showDeleteConfirm.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div>
    <div
      class="bg-white dark:bg-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <!-- Header Section -->
      <div class="p-4 sm:p-5">
        <div class="flex items-start justify-between gap-3 mb-3">
          <!-- Guest Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <h4
                class="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate"
                :title="props.guest.name"
              >
                {{ props.guest.name }}
              </h4>
              <span
                v-if="props.guest.is_group"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/20 shrink-0"
                role="status"
                aria-label="Tamu grup"
              >
                <i class="bi bi-people-fill text-[10px]" aria-hidden="true"></i>
                <span>Grup</span>
              </span>
            </div>

            <!-- Status Badge -->
            <span
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
                getStatusBadge(props.guest.attendance_status).class,
              ]"
              role="status"
              :aria-label="`Status kehadiran: ${
                getStatusBadge(props.guest.attendance_status).text
              }`"
            >
              <i
                :class="getStatusBadge(props.guest.attendance_status).icon"
                class="text-sm"
                aria-hidden="true"
              ></i>
              {{ getStatusBadge(props.guest.attendance_status).text }}
            </span>
          </div>

          <!-- Actions Menu Button -->
          <div ref="actionsRef" class="relative actions-container">
            <button
              @click="toggleActions"
              class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`Menu aksi untuk ${props.guest.name}`"
              aria-haspopup="true"
              :aria-expanded="showActions"
            >
              <i
                class="bi bi-three-dots-vertical text-lg"
                aria-hidden="true"
              ></i>
            </button>

            <!-- Actions Dropdown -->
            <Transition
              enter-active-class="transition-all duration-200"
              enter-from-class="opacity-0 scale-95 -translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-2"
            >
              <div
                v-if="showActions"
                class="absolute right-0 top-full mt-2 w-48 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-30"
                role="menu"
                aria-orientation="vertical"
              >
                <button
                  @click="
                    emit('edit', props.guest);
                    showActions = false;
                  "
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20"
                  role="menuitem"
                  aria-label="Edit data tamu"
                >
                  <i
                    class="bi bi-pencil-fill text-blue-500"
                    aria-hidden="true"
                  ></i>
                  <span>Edit Tamu</span>
                </button>

                <button
                  @click="handleCopyLink"
                  :disabled="copying"
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 focus:outline-none focus:bg-purple-50 dark:focus:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  role="menuitem"
                  aria-label="Salin link undangan"
                >
                  <i
                    :class="
                      copying
                        ? 'bi-hourglass-split animate-spin'
                        : 'bi-clipboard-fill'
                    "
                    class="text-purple-500"
                    aria-hidden="true"
                  ></i>
                  <span>{{ copying ? "Menyalin..." : "Salin Link" }}</span>
                </button>

                <div
                  class="h-px bg-gray-200 dark:bg-gray-800"
                  role="separator"
                ></div>

                <button
                  @click="confirmDelete"
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors duration-200 focus:outline-none focus:bg-rose-50 dark:focus:bg-rose-900/20"
                  role="menuitem"
                  aria-label="Hapus tamu"
                >
                  <i class="bi bi-trash-fill" aria-hidden="true"></i>
                  <span>Hapus Tamu</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="space-y-2.5 mb-4">
          <div
            class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400"
            role="group"
            aria-label="Informasi kontak"
          >
            <div
              class="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <i
                class="bi bi-telephone-fill text-gray-500 dark:text-gray-400"
              ></i>
            </div>
            <span class="font-medium">{{
              props.guest.phone || "Tidak ada nomor"
            }}</span>
          </div>

          <div
            class="flex items-start gap-2.5 text-xs text-gray-500 dark:text-gray-500"
            role="group"
            aria-label="Link undangan"
          >
            <div
              class="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <i
                class="bi bi-link-45deg text-gray-500 dark:text-gray-400 text-sm"
              ></i>
            </div>
            <span class="break-all leading-relaxed pt-1.5">{{
              invitationUrl
            }}</span>
          </div>
        </div>

        <!-- Share Button -->
        <button
          @click="openShareModal"
          class="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Bagikan undangan"
        >
          <i class="bi bi-send-fill" aria-hidden="true"></i>
          <span>Bagikan Undangan</span>
        </button>
      </div>
    </div>

    <!-- Share Modal -->
    <UserInvitationDetailGuestShareModal
      :show="showShareModal"
      :share-url="invitationUrl"
      :share-text="shareText"
      :whatsapp-phone="formattedPhone"
      :title="`Bagikan ke ${props.guest.name}`"
      message="Pilih platform untuk membagikan undangan"
      @close="showShareModal = false"
    />

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          @click.self="showDeleteConfirm = false"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="showDeleteConfirm"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
            >
              <!-- Icon -->
              <div
                class="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-4"
              >
                <i
                  class="bi bi-exclamation-triangle-fill text-rose-600 dark:text-rose-400 text-2xl"
                  aria-hidden="true"
                ></i>
              </div>

              <!-- Title -->
              <h3
                id="delete-dialog-title"
                class="text-xl font-bold text-gray-900 dark:text-white text-center mb-2"
              >
                Hapus Tamu?
              </h3>

              <!-- Description -->
              <p
                class="text-sm text-gray-600 dark:text-gray-400 text-center mb-6"
              >
                Apakah Anda yakin ingin menghapus
                <span class="font-semibold text-gray-900 dark:text-white">{{
                  props.guest.name
                }}</span
                >? Tindakan ini tidak dapat dibatalkan.
              </p>

              <!-- Actions -->
              <div class="flex gap-3">
                <button
                  @click="showDeleteConfirm = false"
                  class="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Batal hapus tamu"
                >
                  Batal
                </button>
                <button
                  @click="handleDelete"
                  class="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Konfirmasi hapus tamu"
                >
                  Hapus
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast Notification -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <div
          v-if="toast.show"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-[calc(100vw-2rem)] backdrop-blur-sm"
          :class="
            toast.type === 'success'
              ? 'bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-200'
              : 'bg-rose-500/95 text-white border border-rose-600'
          "
          role="alert"
          aria-live="polite"
        >
          <i
            :class="
              toast.type === 'success'
                ? 'bi-check-circle-fill text-emerald-400 dark:text-emerald-500'
                : 'bi-x-circle-fill'
            "
            class="text-lg"
            aria-hidden="true"
          ></i>
          <span class="font-semibold text-sm">{{ toast.message }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
