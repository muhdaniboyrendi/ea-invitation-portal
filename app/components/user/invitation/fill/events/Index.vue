<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

const { fetchEvents, createEvent, updateEvent, deleteEvent } = useEventStore();

const validationPatterns = {
  name: {
    required: /^.+$/,
    message: { required: "Nama acara wajib diisi" },
  },
  venue: {
    required: /^.+$/,
    message: { required: "Tempat acara wajib diisi" },
  },
  date: {
    required: /^.+$/,
    message: { required: "Tanggal acara wajib diisi" },
  },
  time_start: {
    required: /^.+$/,
    message: { required: "Waktu mulai wajib diisi" },
  },
  maps_url: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: { pattern: "Format URL tidak valid" },
  },
  maps_embed_url: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: { pattern: "Format URL tidak valid" },
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
  invitation_id: props.invitationId,
  name: "",
  venue: "",
  date: "",
  time_start: "",
  address: "",
  maps_url: "",
  maps_embed_url: "",
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
  eventId: null,
  eventName: "",
});

const events = ref([]);

// Computed Properties
const isEditMode = computed(() => !!ui.editingId);

const isFormValid = computed(() => {
  return (
    Object.keys(validationErrors.value).length === 0 &&
    formData.name &&
    formData.venue &&
    formData.date &&
    formData.time_start
  );
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
  if (!validateField("venue", formData.venue)) isValid = false;
  if (!validateField("date", formData.date)) isValid = false;
  if (!validateField("time_start", formData.time_start)) isValid = false;

  // Optional fields validation
  if (formData.maps_url && !validateField("maps_url", formData.maps_url))
    isValid = false;
  if (
    formData.maps_embed_url &&
    !validateField("maps_embed_url", formData.maps_embed_url)
  )
    isValid = false;

  return isValid;
};

// Input Handlers
const handleInput = (field, value) => {
  clearBackendError(field);
  validateField(field, value);
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// API Calls
const fetchData = async () => {
  ui.isLoading = true;
  try {
    const response = await fetchEvents(props.invitationId);
    events.value = response || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
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
      await updateEvent(ui.editingId, dataToSubmit);
      emit("success", "Data acara berhasil diperbarui!");
    } else {
      await createEvent(dataToSubmit);
      emit("success", "Data acara berhasil ditambahkan!");
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

const handleEdit = (event) => {
  ui.editingId = event.id;
  Object.assign(formData, {
    id: event.id,
    invitation_id: props.invitationId,
    name: event.name || "",
    venue: event.venue || "",
    date: event.date || "",
    time_start: event.time_start || "",
    address: event.address || "",
    maps_url: event.maps_url || "",
    maps_embed_url: event.maps_embed_url || "",
  });
  ui.showForm = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Delete Modal Handlers
const openDeleteModal = (event) => {
  deleteModal.eventId = event.id;
  deleteModal.eventName = event.name;
  deleteModal.show = true;
};

const closeDeleteModal = () => {
  if (!deleteModal.isDeleting) {
    deleteModal.show = false;
    deleteModal.eventId = null;
    deleteModal.eventName = "";
  }
};

const confirmDelete = async () => {
  deleteModal.isDeleting = true;
  try {
    await deleteEvent(deleteModal.eventId);
    emit("success", "Acara berhasil dihapus!");
    await fetchData();
    closeDeleteModal();
  } catch (error) {
    const message = error?.message || "Gagal menghapus acara.";
    emit("error", message);
  } finally {
    deleteModal.isDeleting = false;
  }
};

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    invitation_id: props.invitationId,
    name: "",
    venue: "",
    date: "",
    time_start: "",
    address: "",
    maps_url: "",
    maps_embed_url: "",
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
  if (events.value.length === 0) {
    emit("error", "Mohon tambahkan minimal satu acara.");
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
      <p>Memuat data acara...</p>
    </div>
  </div>

  <div v-else>
    <!-- Event List -->
    <div v-if="events.length > 0" class="mb-8 space-y-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Daftar Acara ({{ events.length }})
        </h3>
      </div>

      <div
        v-for="event in events"
        :key="event.id"
        class="bg-white dark:bg-dark rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ event.name }}
            </h4>
            <p
              class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
            >
              <i class="bi bi-geo-alt-fill"></i>
              {{ event.venue }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="handleEdit(event)"
              class="h-8 aspect-square bg-linear-to-br from-blue-500 to-purple-500 hover:fromm-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-300"
              title="Edit"
            >
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button
              @click="openDeleteModal(event)"
              class="h-8 aspect-square bg-linear-to-br from-red-500 to-rose-500 hover:fromm-red-600 hover:to-rose-600 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-300"
              title="Hapus"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <i class="bi bi-calendar-event"></i>
            <span>{{ formatDate(event.date) }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <i class="bi bi-clock"></i>
            <span>{{ event.time_start }}</span>
          </div>
        </div>

        <div
          v-if="event.address"
          class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <i class="bi bi-map"></i> {{ event.address }}
          </p>
        </div>

        <div v-if="event.maps_url" class="mt-2">
          <a
            :href="event.maps_url"
            target="_blank"
            class="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <i class="bi bi-link-45deg"></i>
            Buka di Google Maps
          </a>
        </div>
      </div>
    </div>

    <!-- Add/Edit Form Toggle Button -->
    <div class="mb-6">
      <button
        @click="toggleForm"
        class="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <i :class="ui.showForm ? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
        {{ ui.showForm ? "Batal" : "Tambah Acara Baru" }}
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="ui.showForm">
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditMode ? "Edit Acara" : "Tambah Acara Baru" }}
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <FormBaseInput
          v-model="formData.name"
          type="text"
          label="Nama Acara"
          placeholder="contoh: Akad Nikah"
          :required="true"
          :error="validationErrors.name"
          @input="handleInput('name', formData.name)"
        />

        <FormBaseInput
          v-model="formData.venue"
          type="text"
          label="Tempat Acara"
          placeholder="contoh: Masjid Al-Ikhlas"
          :required="true"
          :error="validationErrors.venue"
          @input="handleInput('venue', formData.venue)"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormBaseInput
            v-model="formData.date"
            type="date"
            label="Tanggal Acara"
            :required="true"
            :error="validationErrors.date"
            @input="handleInput('date', formData.date)"
          />

          <FormBaseInput
            v-model="formData.time_start"
            type="time"
            label="Waktu Mulai"
            :required="true"
            :error="validationErrors.time_start"
            @input="handleInput('time_start', formData.time_start)"
          />
        </div>

        <FormBaseTextarea
          v-model="formData.address"
          label="Alamat Lengkap (Opsional)"
          placeholder="contoh: Jl. Melati No. 123, Jakarta Selatan"
          :rows="3"
          :error="validationErrors.address"
          @input="handleInput('address', formData.address)"
        />

        <FormBaseInput
          v-model="formData.maps_url"
          type="url"
          label="Link Google Maps (Opsional)"
          placeholder="https://maps.google.com/..."
          :error="validationErrors.maps_url"
          @input="handleInput('maps_url', formData.maps_url)"
        />

        <FormBaseInput
          v-model="formData.maps_embed_url"
          type="url"
          label="Link Embed Google Maps (Opsional)"
          placeholder="https://www.google.com/maps/embed?..."
          :error="validationErrors.maps_embed_url"
          @input="handleInput('maps_embed_url', formData.maps_embed_url)"
        />

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
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            <span v-if="!ui.isSubmitting">
              {{ isEditMode ? "Perbarui Acara" : "Simpan Acara" }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Spinner />
              {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
            </span>
          </button>
        </div>
      </form>
    </div>

    <!-- Next Button -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <button
        @click="handleNext"
        :disabled="events.length === 0"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
      >
        Lanjutkan
        <i class="bi bi-arrow-right ml-2"></i>
      </button>
      <p
        v-if="events.length === 0"
        class="text-center text-sm text-red-500 dark:text-red-400 mt-2"
      >
        Tambahkan minimal satu acara untuk melanjutkan
      </p>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :show="deleteModal.show"
      :is-deleting="deleteModal.isDeleting"
      title="Hapus Acara?"
      message="Apakah Anda yakin ingin menghapus acara"
      :item-name="deleteModal.eventName"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>
