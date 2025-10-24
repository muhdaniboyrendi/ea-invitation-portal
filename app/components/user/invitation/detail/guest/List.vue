<script setup>
const config = useRuntimeConfig();
const appUrl = config.public.appUrl;

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

// Format attendance status badge
const getStatusBadge = (status) => {
  const badges = {
    attending: {
      text: "Hadir",
      class:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    not_attending: {
      text: "Tidak Hadir",
      class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    pending: {
      text: "Menunggu",
      class:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
  };
  return badges[status] || badges.pending;
};

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

      <div
        v-for="guest in guests"
        :key="guest.id"
        class="bg-white dark:bg-dark rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h4 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ guest.name }}
              </h4>
              <span
                v-if="guest.is_group"
                class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                <i class="bi bi-people-fill"></i> Grup
              </span>
            </div>
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                getStatusBadge(guest.attendance_status).class,
              ]"
            >
              {{ getStatusBadge(guest.attendance_status).text }}
            </span>
          </div>
          <div class="flex gap-2">
            <button
              @click="handleEdit(guest)"
              class="h-10 aspect-square bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 text-white rounded-xl transition-all duration-300"
              title="Edit"
            >
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button
              @click="openDeleteModal(guest)"
              class="h-10 aspect-square bg-gradient-to-br from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 hover:scale-105 active:scale-95 text-white rounded-xl transition-all duration-300"
              title="Hapus"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
            <a
              :href="`${appUrl}/${invitationSlug}?guest=${guest.slug}`"
              target="_blank"
              class="h-10 aspect-square bg-gradient-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 hover:scale-105 active:scale-95 text-white rounded-xl transition-all duration-300 flex justify-center items-center"
            >
              <i class="bi bi-send-fill"></i>
            </a>
          </div>
        </div>

        <div class="text-sm text-gray-700 dark:text-gray-300">
          <i class="bi bi-telephone"></i>
          {{ guest.phone ? guest.phone : "-" }}
        </div>
      </div>
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
