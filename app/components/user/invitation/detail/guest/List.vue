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
    <!-- Guest List -->
    <div
      v-if="guests.length > 0"
      class="mb-8 space-y-4 p-6 md:p-8 bg-off-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
    >
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="h-12 aspect-square rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 text-white flex justify-center items-center"
          >
            <i class="bi bi-person-plus-fill text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Daftar Tamu
          </h3>
        </div>

        <!-- Guest Limit Info -->
        <div
          v-if="maxGuests !== null"
          class="mb-4 p-3 rounded-2xl"
          :class="
            isGuestLimitReached
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          "
        >
          <div class="flex items-center gap-3">
            <i
              :class="[
                'bi text-lg',
                isGuestLimitReached
                  ? 'bi-exclamation-triangle-fill text-red-600 dark:text-red-400'
                  : 'bi-info-circle-fill text-blue-600 dark:text-blue-400',
              ]"
            ></i>
            <div class="flex-1">
              <p
                :class="[
                  'text-sm font-medium',
                  isGuestLimitReached
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-blue-800 dark:text-blue-200',
                ]"
              >
                <span v-if="isGuestLimitReached">
                  Batas maksimal tamu telah tercapai
                </span>
                <span v-else>
                  Kuota tamu: {{ guests.length }} / {{ maxGuests }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <UserInvitationDetailGuestCard
        v-for="guest in guests"
        :key="guest.id"
        :guest="guest"
        :invitation-slug="invitationSlug"
        @edit="handleEdit"
        @delete="openDeleteModal"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="p-6 md:p-8 bg-off-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
    >
      <div class="p-12 text-center">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl mb-6"
        >
          <i class="bi bi-people text-4xl text-blue-600 dark:text-blue-400"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Belum Ada Tamu
        </h3>
        <p class="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
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
