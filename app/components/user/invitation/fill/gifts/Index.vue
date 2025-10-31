<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "info", "error", "next"]);

const { fetchGifts, createGift, updateGift, deleteGift } = useGiftStore();

const validationPatterns = {
  bank_name: {
    required: /^.+$/,
    message: { required: "Nama bank atau e-wallet wajib diisi" },
  },
  account_number: {
    required: /^.+$/,
    message: { required: "Nomor rekening atau e-wallet wajib diisi" },
  },
  account_holder: {
    required: /^.+$/,
    message: { required: "Nama pemilik rekening atau e-wallet wajib diisi" },
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
  bank_name: "",
  account_number: "",
  account_holder: "",
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
  giftId: null,
  giftName: "",
});

const gifts = ref([]);

// Computed Properties
const isEditMode = computed(() => !!ui.editingId);

const isFormValid = computed(() => {
  return (
    Object.keys(validationErrors.value).length === 0 &&
    formData.bank_name &&
    formData.account_number &&
    formData.account_holder
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
  if (!validateField("bank_name", formData.bank_name)) isValid = false;
  if (!validateField("account_number", formData.account_number))
    isValid = false;
  if (!validateField("account_holder", formData.account_holder))
    isValid = false;
  return isValid;
};

// Input Handlers
const handleInput = (field, value) => {
  clearBackendError(field);
  validateField(field, value);
};

// Bank Logo Helper
const getBankLogo = (bankName) => {
  const bankLogos = {
    BCA: "💳",
    BRI: "🏦",
    BNI: "🏛️",
    Mandiri: "🏢",
    CIMB: "💰",
    Permata: "💎",
    BTN: "🏘️",
    Danamon: "🌟",
    OCBC: "🔷",
    Panin: "🔶",
  };

  const found = Object.keys(bankLogos).find((key) =>
    bankName.toUpperCase().includes(key)
  );
  return found ? bankLogos[found] : "🏦";
};

// API Calls
const fetchData = async () => {
  ui.isLoading = true;
  try {
    const response = await fetchGifts(props.invitationId);
    gifts.value = response || [];
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
  } finally {
    ui.isLoading = false;
  }
};

const refreshData = async () => {
  try {
    const response = await fetchGifts(props.invitationId);
    gifts.value = response || [];
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
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
      await updateGift(ui.editingId, dataToSubmit);
      emit("success", "Rekening hadiah berhasil diperbarui!");
    } else {
      await createGift(dataToSubmit);
      emit("success", "Rekening hadiah berhasil ditambahkan!");
    }

    await refreshData();
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

const handleEdit = (gift) => {
  ui.editingId = gift.id;
  Object.assign(formData, {
    id: gift.id,
    invitation_id: props.invitationId,
    bank_name: gift.bank_name || "",
    account_number: gift.account_number || "",
    account_holder: gift.account_holder || "",
  });

  ui.showForm = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Delete Modal Handlers
const openDeleteModal = (gift) => {
  deleteModal.giftId = gift.id;
  deleteModal.giftName = gift.bank_name;
  deleteModal.show = true;
};

const closeDeleteModal = () => {
  if (!deleteModal.isDeleting) {
    deleteModal.show = false;
    deleteModal.giftId = null;
    deleteModal.giftName = "";
  }
};

const confirmDelete = async () => {
  deleteModal.isDeleting = true;
  try {
    await deleteGift(deleteModal.giftId);
    emit("success", "Rekening hadiah berhasil dihapus!");
    closeDeleteModal();
    await fetchData();
  } catch (error) {
    const message = error?.message || "Gagal menghapus rekening hadiah.";
    emit("error", message);
  } finally {
    deleteModal.isDeleting = false;
  }
};

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    invitation_id: props.invitationId,
    bank_name: "",
    account_number: "",
    account_holder: "",
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
  emit("next");
};

// Copy to clipboard helper
const copyToClipboard = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    emit("info", `${label} berhasil disalin!`);
  } catch (error) {
    emit("error", "Gagal menyalin ke clipboard");
  }
};

onMounted(() => {
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
        Memuat data hadiah...
      </p>
    </div>
  </div>

  <div v-else class="space-y-4 md:space-y-6">
    <!-- Gift List Header -->
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center flex-shrink-0"
          >
            <i class="bi bi-gift text-sky-500 text-lg"></i>
          </div>
          <div>
            <h2
              class="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              Rekening Hadiah
            </h2>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              {{ gifts.length }} rekening tersimpan
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gift List -->
    <div v-if="gifts.length > 0" class="space-y-3">
      <div
        v-for="gift in gifts"
        :key="gift.id"
        class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start gap-3 mb-4">
          <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900 flex items-center justify-center text-2xl flex-shrink-0"
          >
            {{ getBankLogo(gift.bank_name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h4
              class="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50 mb-1"
            >
              {{ gift.bank_name }}
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300">
              {{ gift.account_holder }}
            </p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button
              @click="handleEdit(gift)"
              class="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 transition-all active:scale-95"
              title="Edit"
            >
              <i class="bi bi-pencil text-sm"></i>
            </button>
            <button
              @click="openDeleteModal(gift)"
              class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-all active:scale-95"
              title="Hapus"
            >
              <i class="bi bi-trash text-sm"></i>
            </button>
          </div>
        </div>

        <div
          class="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 md:p-4 border border-slate-200 dark:border-slate-700"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Nomor Rekening/E-Wallet
              </p>
              <p
                class="text-sm md:text-base font-mono font-bold text-slate-900 dark:text-slate-50 tracking-wider truncate"
              >
                {{ gift.account_number }}
              </p>
            </div>
            <button
              @click="copyToClipboard(gift.account_number, 'Nomor rekening')"
              class="flex-shrink-0 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-all active:scale-95 flex items-center gap-2 text-xs font-medium"
              title="Salin nomor"
            >
              <i class="bi bi-clipboard"></i>
              <span class="hidden sm:inline">Salin</span>
            </button>
          </div>
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
        <i class="bi bi-gift text-sky-500 text-3xl"></i>
      </div>
      <h3
        class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2"
      >
        Belum Ada Rekening Hadiah
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Tambahkan rekening untuk menerima hadiah dari tamu
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
      {{ ui.showForm ? "Batal" : "Tambah Rekening Baru" }}
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
          <i class="bi bi-bank text-sky-500"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {{ isEditMode ? "Edit Rekening" : "Tambah Rekening Baru" }}
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3 md:space-y-6">
        <FormBaseInput
          v-model="formData.bank_name"
          type="text"
          label="Nama Bank/E-Wallet"
          placeholder="contoh: Bank BCA atau GoPay"
          :required="true"
          :error="validationErrors.bank_name"
          @input="handleInput('bank_name', formData.bank_name)"
        />

        <FormBaseInput
          v-model="formData.account_number"
          type="text"
          label="Nomor Rekening/E-Wallet"
          placeholder="contoh: 1234567890"
          :required="true"
          :error="validationErrors.account_number"
          @input="handleInput('account_number', formData.account_number)"
        />

        <FormBaseInput
          v-model="formData.account_holder"
          type="text"
          label="Nama Pemilik"
          placeholder="contoh: John Doe"
          :required="true"
          :error="validationErrors.account_holder"
          @input="handleInput('account_holder', formData.account_holder)"
        />

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
        class="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Lanjutkan
        <i class="bi bi-arrow-right"></i>
      </button>
      <p class="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
        Rekening hadiah bersifat opsional, Anda bisa melewatinya
      </p>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :show="deleteModal.show"
      :is-deleting="deleteModal.isDeleting"
      title="Hapus Rekening Hadiah?"
      message="Apakah Anda yakin ingin menghapus rekening"
      :item-name="deleteModal.giftName"
      confirm-text="Hapus"
      cancel-text="Batal"
      type="danger"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>
