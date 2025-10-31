<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next", "step-status"]);

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

// watch(
//   isEditMode,
//   (newValue) => {
//     emit("step-status", newValue);
//   },
//   { immediate: true }
// );

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

    emit("step-status", true);
    events.value = response || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
  } finally {
    ui.isLoading = false;
  }
};

const refreshData = async () => {
  try {
    const response = await fetchEvents(props.invitationId);
    events.value = response || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
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

    await refreshData();
    resetForm();
    ui.showForm = false;
    emit("step-status", true);
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
  deleteModal.show = false;
  deleteModal.eventId = null;
  deleteModal.eventName = "";
};

const confirmDelete = async () => {
  deleteModal.isDeleting = true;
  try {
    await deleteEvent(deleteModal.eventId);
    emit("success", "Acara berhasil dihapus!");
    closeDeleteModal();
    await fetchData();
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
  emit("step-status", false);
  fetchData();
});
</script>

<template>
  <!-- Loading State -->
  <div
    v-if="ui.isLoading"
    class="min-h-[60vh] flex items-center justify-center"
  >
    <div class="text-center space-y-4 md:space-y-6">
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950 backdrop-blur-sm"
      >
        <div
          class="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="text-sm font-medium text-slate-600 dark:text-slate-300">
        Memuat data acara...
      </p>
    </div>
  </div>

  <div v-else class="space-y-4 md:space-y-6">
    <!-- Event List Header -->
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-calendar-event text-sky-500 text-lg"></i>
          </div>
          <div>
            <h2
              class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              Daftar Acara
            </h2>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              {{ events.length }} acara tersimpan
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Event List -->
    <div v-if="events.length > 0" class="space-y-3">
      <div
        v-for="event in events"
        :key="event.id"
        class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start gap-3 mb-3">
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-calendar-check text-sky-500"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h4
              class="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50 mb-1"
            >
              {{ event.name }}
            </h4>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
            >
              <i class="bi bi-geo-alt-fill text-sky-500"></i>
              {{ event.venue }}
            </p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button
              @click="handleEdit(event)"
              class="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 transition-all active:scale-95"
              title="Edit"
            >
              <i class="bi bi-pencil text-sm"></i>
            </button>
            <button
              @click="openDeleteModal(event)"
              class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-all active:scale-95"
              title="Hapus"
            >
              <i class="bi bi-trash text-sm"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div
            class="flex items-center gap-2 text-slate-600 dark:text-slate-300"
          >
            <i class="bi bi-calendar3 text-sky-500"></i>
            <span class="truncate">{{ formatDate(event.date) }}</span>
          </div>
          <div
            class="flex items-center gap-2 text-slate-600 dark:text-slate-300"
          >
            <i class="bi bi-clock text-sky-500"></i>
            <span>{{ event.time_start }}</span>
          </div>
        </div>

        <div
          v-if="event.address"
          class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800"
        >
          <p
            class="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2"
          >
            <i class="bi bi-map text-sky-500 flex-shrink-0 mt-0.5"></i>
            <span>{{ event.address }}</span>
          </p>
        </div>

        <div v-if="event.maps_url" class="mt-2">
          <a
            :href="event.maps_url"
            target="_blank"
            class="inline-flex items-center gap-1.5 text-xs text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors"
          >
            <i class="bi bi-box-arrow-up-right"></i>
            Buka di Google Maps
          </a>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800"
    >
      <div
        class="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center mb-4"
      >
        <i class="bi bi-calendar-event text-sky-500 text-3xl"></i>
      </div>
      <h3
        class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2"
      >
        Belum Ada Acara
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Tambahkan acara-acara penting untuk undangan Anda
      </p>
    </div>

    <!-- Toggle Form Button -->
    <button
      @click="toggleForm"
      class="w-full h-12 rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      :class="
        ui.showForm
          ? 'bg-slate-500 hover:bg-slate-600 text-white shadow-slate-500/25'
          : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25'
      "
    >
      <i :class="ui.showForm ? 'bi-x-lg' : 'bi-plus-lg'"></i>
      {{ ui.showForm ? "Batal" : "Tambah Acara Baru" }}
    </button>

    <!-- Add/Edit Form -->
    <div
      v-if="ui.showForm"
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
    >
      <div class="flex items-center gap-2 mb-1 md:mb-4">
        <div
          class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
        >
          <i class="bi bi-pencil-square text-sky-500"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {{ isEditMode ? "Edit Acara" : "Tambah Acara Baru" }}
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3 md:space-y-6">
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

        <div class="grid grid-cols-2 gap-3">
          <FormBaseInput
            v-model="formData.date"
            type="date"
            label="Tanggal"
            :required="true"
            :error="validationErrors.date"
            @input="handleInput('date', formData.date)"
          />

          <FormBaseInput
            v-model="formData.time_start"
            type="time"
            label="Jam Mulai"
            :required="true"
            :error="validationErrors.time_start"
            @input="handleInput('time_start', formData.time_start)"
          />
        </div>

        <FormBaseTextarea
          v-model="formData.address"
          label="Alamat Lengkap"
          placeholder="contoh: Jl. Melati No. 123, Jakarta Selatan"
          :rows="3"
          :error="validationErrors.address"
          @input="handleInput('address', formData.address)"
        >
          <template #hint>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              Opsional
            </span>
          </template>
        </FormBaseTextarea>

        <FormBaseInput
          v-model="formData.maps_url"
          type="url"
          label="Link Google Maps"
          placeholder="https://maps.google.com/..."
          :error="validationErrors.maps_url"
          @input="handleInput('maps_url', formData.maps_url)"
        >
          <template #hint>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              Opsional
            </span>
          </template>
        </FormBaseInput>

        <FormBaseInput
          v-model="formData.maps_embed_url"
          type="url"
          label="Link Embed Google Maps"
          placeholder="https://www.google.com/maps/embed?..."
          :error="validationErrors.maps_embed_url"
          @input="handleInput('maps_embed_url', formData.maps_embed_url)"
        >
          <template #hint>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              Opsional
            </span>
          </template>
        </FormBaseInput>

        <div class="flex gap-3 pt-3">
          <button
            type="button"
            @click="toggleForm"
            :disabled="ui.isSubmitting"
            class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
          >
            <i class="bi bi-x-lg text-lg"></i>
          </button>
          <button
            type="submit"
            :disabled="ui.isSubmitting || !isFormValid"
            class="flex-1 h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span v-if="!ui.isSubmitting">
              <i
                :class="isEditMode ? 'bi-check-circle' : 'bi-save'"
                class="bi mr-1"
              ></i>
              {{ isEditMode ? "Perbarui" : "Simpan" }}
            </span>
            <span v-else class="flex items-center gap-2">
              <Spinner />
              {{ isEditMode ? "Memperbarui..." : "Menyimpan..." }}
            </span>
          </button>
        </div>
      </form>
    </div>

    <!-- Next Button -->
    <div class="pt-2">
      <button
        @click="handleNext"
        :disabled="events.length === 0"
        class="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Lanjutkan
        <i class="bi bi-arrow-right"></i>
      </button>
      <p
        v-if="events.length === 0"
        class="text-center text-xs text-red-500 dark:text-red-400 mt-2"
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
