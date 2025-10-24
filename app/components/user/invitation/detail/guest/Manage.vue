<script setup>
const { fetchInvitation } = useInvitationStore();
const route = useRoute();

const invitationId = route.params.id;

const props = defineProps({
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

const { fetchGuests, createGuest, updateGuest, deleteGuest } = useGuestStore();

const validationPatterns = {
  name: {
    required: /^.+$/,
    message: { required: "Nama tamu wajib diisi" },
  },
  phone: {
    pattern: /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{7,15}$/,
    message: { pattern: "Format nomor telepon tidak valid" },
  },
};

// Form Validation Composable
const {
  validationErrors,
  clearBackendError,
  setBackendValidationErrors,
  validateWithPattern,
  resetErrors,
} = useFormValidation(validationPatterns);

// Reactive form data object
const formData = reactive({
  id: null,
  invitation_id: invitationId,
  name: "",
  phone: "",
  is_group: false,
});

const ui = reactive({
  isLoading: true,
  isSubmitting: false,
  showForm: false,
  editingId: null,
});

// Delete Modal State
const deleteModal = reactive({
  show: false,
  isDeleting: false,
  guestId: null,
  guestName: "",
});

const guests = ref([]);

// Computed Properties
const isEditMode = computed(() => !!ui.editingId);

const isFormValid = computed(() => {
  return Object.keys(validationErrors.value).length === 0 && formData.name;
});

// Statistics
const statistics = computed(() => {
  const total = guests.value.length;
  const attending = guests.value.filter(
    (g) => g.attendance_status === "attending"
  ).length;
  const notAttending = guests.value.filter(
    (g) => g.attendance_status === "not_attending"
  ).length;
  const pending = guests.value.filter(
    (g) => g.attendance_status === "pending"
  ).length;

  return { total, attending, notAttending, pending };
});

// Validation Methods
const validateField = (field, value) => {
  const pattern = validationPatterns[field];
  if (!pattern) return true;
  return validateWithPattern(field, value, pattern);
};

const validateForm = () => {
  let isValid = true;
  if (!validateField("name", formData.name)) isValid = false;

  // Optional fields validation
  if (formData.phone && !validateField("phone", formData.phone))
    isValid = false;

  return isValid;
};

// Input Handlers
const handleInput = (field, value) => {
  clearBackendError(field);
  validateField(field, value);
};

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

const loadInvitationData = async () => {
  try {
    const response = await fetchInvitation(invitationId);
  } catch (error) {
    console.error("Failed to load invitation data:", error);
  }
};

const loadGuestData = async () => {
  try {
    const response = await fetchGuests(invitationId);
  } catch (error) {
    console.error("Failed to load guest data:", error);
  }
};

const fetchData = async () => {
  ui.isLoading = true;

  try {
    await loadInvitationData();
    await loadGuestData();
  } catch (error) {
    console.error("Failed to fetch guests:", error);
  } finally {
    ui.isLoading = false;
  }
};

const submitForm = async () => {
  if (!validateForm()) {
    emit("error", "Mohon periksa kembali, ada data yang belum valid.");
    return;
  }
  if (ui.isSubmitting) return;

  ui.isSubmitting = true;
  try {
    const dataToSubmit = { ...formData };

    if (isEditMode.value) {
      await updateGuest(ui.editingId, dataToSubmit);
      emit("success", "Data tamu berhasil diperbarui!");
    } else {
      await createGuest(dataToSubmit);
      emit("success", "Data tamu berhasil ditambahkan!");
    }

    await fetchData();
    resetForm();
    ui.showForm = false;
  } catch (error) {
    const backendErrors =
      error?.validationErrors || error?.response?.data?.validationErrors;
    if (backendErrors) setBackendValidationErrors(backendErrors);

    const message =
      error?.message ||
      error?.response?.data?.message ||
      `Gagal ${isEditMode.value ? "memperbarui" : "menyimpan"} data.`;
    emit("error", message);
  } finally {
    ui.isSubmitting = false;
  }
};

const handleEdit = (guest) => {
  ui.editingId = guest.id;
  Object.assign(formData, {
    id: guest.id,
    invitation_id: invitationId,
    name: guest.name || "",
    phone: guest.phone || "",
    is_group: guest.is_group || false,
  });
  ui.showForm = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    await fetchData();
  } catch (error) {
    const message = error?.message || "Gagal menghapus tamu.";
    emit("error", message);
  } finally {
    deleteModal.isDeleting = false;
  }
};

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    invitation_id: invitationId,
    name: "",
    phone: "",
    is_group: false,
  });

  ui.editingId = null;
  resetErrors();
};

const toggleForm = () => {
  if (ui.showForm) {
    resetForm();
  }
  ui.showForm = !ui.showForm;
};

const handleNext = () => {
  if (guests.value.length === 0) {
    emit("error", "Mohon tambahkan minimal satu tamu.");
    return;
  }
  emit("next");
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div v-if="ui.isLoading" class="text-center py-8">
    <div
      class="flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
    >
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
      ></div>
      <p>Memuat data tamu...</p>
    </div>
  </div>

  <div v-else>
    <!-- Statistics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div
        class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90 mb-1">Total Tamu</p>
            <p class="text-3xl font-bold">{{ statistics.total }}</p>
          </div>
          <i class="bi bi-people-fill text-4xl opacity-80"></i>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90 mb-1">Hadir</p>
            <p class="text-3xl font-bold">{{ statistics.attending }}</p>
          </div>
          <i class="bi bi-check-circle-fill text-4xl opacity-80"></i>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90 mb-1">Tidak Hadir</p>
            <p class="text-3xl font-bold">{{ statistics.notAttending }}</p>
          </div>
          <i class="bi bi-x-circle-fill text-4xl opacity-80"></i>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90 mb-1">Menunggu</p>
            <p class="text-3xl font-bold">{{ statistics.pending }}</p>
          </div>
          <i class="bi bi-clock-fill text-4xl opacity-80"></i>
        </div>
      </div>
    </div>

    <!-- Add/Edit Form Toggle Button -->
    <div class="mb-6">
      <button
        @click="toggleForm"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <i :class="ui.showForm ? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
        {{ ui.showForm ? "Batal" : "Tambah Tamu Baru" }}
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="ui.showForm" class="mb-8">
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditMode ? "Edit Tamu" : "Tambah Tamu Baru" }}
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <FormBaseInput
          v-model="formData.name"
          type="text"
          label="Nama Tamu"
          placeholder="contoh: Budi Santoso"
          :required="true"
          :error="validationErrors.name"
          @input="handleInput('name', formData.name)"
        />

        <FormBaseInput
          v-model="formData.phone"
          type="tel"
          label="Nomor Telepon (Opsional)"
          placeholder="contoh: 08123456789"
          :error="validationErrors.phone"
          @input="handleInput('phone', formData.phone)"
        />

        <div class="flex items-center gap-3">
          <input
            v-model="formData.is_group"
            type="checkbox"
            id="is_group"
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="is_group"
            class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tamu Grup / Keluarga (otomatis hadir)
          </label>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="toggleForm"
            :disabled="ui.isSubmitting"
            class="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-700 dark:text-slate-300 text-gray-700 font-medium rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="ui.isSubmitting || !isFormValid"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            <span v-if="!ui.isSubmitting">
              {{ isEditMode ? "Perbarui Tamu" : "Simpan Tamu" }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Spinner />
              {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
            </span>
          </button>
        </div>
      </form>
    </div>

    <!-- Guest List -->
    <div v-if="guests.length > 0" class="mb-8 space-y-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Daftar Tamu ({{ guests.length }})
        </h3>
      </div>

      <div
        v-for="guest in guests"
        :key="guest.id"
        class="bg-white dark:bg-dark rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
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
              class="h-8 aspect-square bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-300"
              title="Edit"
            >
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button
              @click="openDeleteModal(guest)"
              class="h-8 aspect-square bg-gradient-to-br from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-300"
              title="Hapus"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>

        <div
          v-if="guest.phone"
          class="text-sm text-gray-700 dark:text-gray-300"
        >
          <i class="bi bi-telephone"></i>
          {{ guest.phone }}
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center mb-8 border-2 border-dashed border-blue-200 dark:border-blue-800"
    >
      <i class="bi bi-people text-6xl text-blue-300 dark:text-blue-700"></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">
        Belum Ada Tamu
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        Tambahkan daftar tamu untuk undangan Anda
      </p>
    </div>

    <!-- Next Button -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <button
        @click="handleNext"
        :disabled="guests.length === 0"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
      >
        Lanjutkan
        <i class="bi bi-arrow-right ml-2"></i>
      </button>
      <p
        v-if="guests.length === 0"
        class="text-center text-sm text-red-500 dark:text-red-400 mt-2"
      >
        Tambahkan minimal satu tamu untuk melanjutkan
      </p>
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
