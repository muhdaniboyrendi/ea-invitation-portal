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
const mainAppUrl = config.public.mainAppUrl;

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
        "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    not_attending: {
      text: "Tidak Hadir",
      icon: "bi-x-circle-fill",
      class:
        "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    },
    pending: {
      text: "Menunggu",
      icon: "bi-clock-fill",
      class:
        "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
  };
  return badges[status] || badges.pending;
};

// Generate invitation URL
const invitationUrl = computed(() => {
  return `${mainAppUrl}/${props.invitationSlug}?guest=${props.guest.slug}`;
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
  if (e.key === "Escape") {
    if (showActions.value) showActions.value = false;
    if (showShareModal.value) showShareModal.value = false;
    if (showDeleteConfirm.value) showDeleteConfirm.value = false;
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
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <!-- Main Content -->
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <!-- Guest Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <h4
                class="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50 truncate"
                :title="props.guest.name"
              >
                {{ props.guest.name }}
              </h4>
              <span
                v-if="props.guest.is_group"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 shrink-0"
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
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border',
                getStatusBadge(props.guest.attendance_status).class,
              ]"
              role="status"
            >
              <i
                :class="getStatusBadge(props.guest.attendance_status).icon"
                class="text-xs"
                aria-hidden="true"
              ></i>
              {{ getStatusBadge(props.guest.attendance_status).text }}
            </span>
          </div>

          <!-- Actions Menu Button -->
          <div ref="actionsRef" class="relative">
            <button
              @click="toggleActions"
              class="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
              :aria-label="`Menu aksi untuk ${props.guest.name}`"
              aria-haspopup="true"
              :aria-expanded="showActions"
            >
              <i class="bi bi-three-dots-vertical text-lg"></i>
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
                class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden z-30"
                role="menu"
              >
                <button
                  @click="
                    emit('edit', props.guest);
                    showActions = false;
                  "
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors"
                  role="menuitem"
                >
                  <i class="bi bi-pencil-fill text-sky-500"></i>
                  <span>Edit Tamu</span>
                </button>

                <button
                  @click="handleCopyLink"
                  :disabled="copying"
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors disabled:opacity-50"
                  role="menuitem"
                >
                  <i
                    :class="
                      copying
                        ? 'bi-hourglass-split animate-spin'
                        : 'bi-clipboard-fill'
                    "
                    class="text-sky-500"
                  ></i>
                  <span>{{ copying ? "Menyalin..." : "Salin Link" }}</span>
                </button>

                <div class="h-px bg-slate-200 dark:bg-slate-800"></div>

                <button
                  @click="confirmDelete"
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  role="menuitem"
                >
                  <i class="bi bi-trash-fill"></i>
                  <span>Hapus Tamu</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="space-y-2 mb-3">
          <div
            class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
          >
            <div
              class="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
            >
              <i
                class="bi bi-telephone-fill text-slate-500 dark:text-slate-400 text-xs"
              ></i>
            </div>
            <span class="font-medium truncate">{{
              props.guest.phone || "Tidak ada nomor"
            }}</span>
          </div>

          <div
            class="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-500"
          >
            <div
              class="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
            >
              <i
                class="bi bi-link-45deg text-slate-500 dark:text-slate-400"
              ></i>
            </div>
            <span class="break-all leading-relaxed pt-0.5">{{
              invitationUrl
            }}</span>
          </div>
        </div>

        <!-- Share Button -->
        <button
          @click="openShareModal"
          class="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
        >
          <i class="bi bi-send-fill"></i>
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
              class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800"
            >
              <!-- Icon -->
              <div
                class="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950 flex items-center justify-center mx-auto mb-4"
              >
                <i
                  class="bi bi-exclamation-triangle-fill text-red-500 text-2xl"
                ></i>
              </div>

              <!-- Title -->
              <h3
                class="text-xl font-bold text-slate-900 dark:text-slate-50 text-center mb-2"
              >
                Hapus Tamu?
              </h3>

              <!-- Description -->
              <p
                class="text-sm text-slate-600 dark:text-slate-300 text-center mb-6"
              >
                Apakah Anda yakin ingin menghapus
                <span class="font-semibold text-slate-900 dark:text-slate-50">{{
                  props.guest.name
                }}</span
                >? Tindakan ini tidak dapat dibatalkan.
              </p>

              <!-- Actions -->
              <div class="flex gap-3">
                <button
                  @click="showDeleteConfirm = false"
                  class="flex-1 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all active:scale-[0.98]"
                >
                  Batal
                </button>
                <button
                  @click="handleDelete"
                  class="flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-red-500/25"
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
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-[calc(100vw-2rem)] border"
          :class="
            toast.type === 'success'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 dark:border-slate-200'
              : 'bg-red-500 text-white border-red-600'
          "
          role="alert"
        >
          <i
            :class="
              toast.type === 'success'
                ? 'bi-check-circle-fill text-emerald-400 dark:text-emerald-500'
                : 'bi-x-circle-fill'
            "
            class="text-lg"
          ></i>
          <span class="font-semibold text-sm">{{ toast.message }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
