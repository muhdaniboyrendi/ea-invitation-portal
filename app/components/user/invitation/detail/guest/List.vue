<script setup>
const props = defineProps({
  guests: {
    type: Array,
    required: true,
    default: () => [],
  },
  invitationSlug: {
    type: String,
    required: true,
  },
  maxGuests: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["edit", "delete", "success", "error"]);

// Delete Modal State
const deleteModal = reactive({
  show: false,
  isDeleting: false,
  guestId: null,
  guestName: "",
});

const { deleteGuest } = useGuestStore();

// Check if guest limit reached
const isGuestLimitReached = computed(() => {
  if (props.maxGuests === null) return false;
  return props.guests.length >= props.maxGuests;
});

const handleEdit = (guest) => {
  emit("edit", guest);
};

// Delete Modal Handlers
const openDeleteModal = (guest) => {
  deleteModal.guestId = guest.id;
  deleteModal.guestName = guest.name;
  deleteModal.show = true;
};

const closeDeleteModal = () => {
  deleteModal.show = false;
  deleteModal.guestId = null;
  deleteModal.guestName = "";
};

const confirmDelete = async () => {
  deleteModal.isDeleting = true;
  try {
    await deleteGuest(deleteModal.guestId);
    emit("success", "Tamu berhasil dihapus!");
    closeDeleteModal();
    emit("delete");
  } catch (error) {
    const message = error?.message || "Gagal menghapus tamu.";
    emit("error", message);
  } finally {
    deleteModal.isDeleting = false;
  }
};
</script>

<template>
  <div>
    <!-- Guest List with Data -->
    <div
      v-if="guests.length > 0"
      class="space-y-4"
    >
      <!-- Header with Guest Limit Info -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-people-fill text-sky-500 text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3
              class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              Daftar Tamu
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {{ guests.length }} tamu terdaftar
            </p>
          </div>
        </div>

        <!-- Guest Limit Badge -->
        <div
          v-if="maxGuests !== null"
          class="flex-shrink-0 px-3 py-2 rounded-xl border-2"
          :class="
            isGuestLimitReached
              ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
          "
        >
          <div class="flex items-center gap-2">
            <i
              class="text-sm"
              :class="[
                'bi',
                isGuestLimitReached
                  ? 'bi-exclamation-triangle-fill text-red-500'
                  : 'bi-info-circle-fill text-blue-500',
              ]"
            ></i>
            <div class="text-xs font-semibold whitespace-nowrap">
              <span
                v-if="isGuestLimitReached"
                :class="
                  isGuestLimitReached
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-blue-600 dark:text-blue-400'
                "
              >
                Kuota Penuh
              </span>
              <span
                v-else
                class="text-blue-600 dark:text-blue-400"
              >
                {{ guests.length }}/{{ maxGuests }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Guest Cards -->
      <div class="space-y-2 md:space-y-3">
        <UserInvitationDetailGuestCard
          v-for="guest in guests"
          :key="guest.id"
          :guest="guest"
          :invitation-slug="invitationSlug"
          @edit="handleEdit"
          @delete="openDeleteModal"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <div class="py-12 text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-950 rounded-2xl mb-4 md:mb-6"
        >
          <i
            class="bi bi-people text-3xl md:text-4xl text-slate-400 dark:text-slate-500"
          ></i>
        </div>
        <h3
          class="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2"
        >
          Belum Ada Tamu
        </h3>
        <p
          class="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto px-4"
        >
          Mulai tambahkan daftar tamu untuk undangan Anda dengan menekan tombol
          di atas
        </p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :show="deleteModal.show"
      :is-deleting="deleteModal.isDeleting"
      title="Hapus Tamu?"
      message="Apakah Anda yakin ingin menghapus tamu"
      :item-name="deleteModal.guestName"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>