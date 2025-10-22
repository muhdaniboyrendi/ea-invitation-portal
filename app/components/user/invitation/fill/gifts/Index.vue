<script setup>
const props = defineProps({
  invitationId: { type: String, required: true },
  packageId: { type: [Number, String], required: true },
});

const emit = defineEmits(["success", "error", "next"]);

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
    emit("success", `${label} berhasil disalin!`);
  } catch (error) {
    emit("error", "Gagal menyalin ke clipboard");
  }
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
      <p>Memuat data hadiah...</p>
    </div>
  </div>

  <div v-else>
    <!-- Gift List -->
    <div v-if="gifts.length > 0" class="mb-8 space-y-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Daftar Hadiah ({{ gifts.length }})
        </h3>
      </div>

      <div
        v-for="gift in gifts"
        :key="gift.id"
        class="bg-white dark:bg-dark rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3 flex-1">
              <div
                class="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl flex items-center justify-center text-3xl"
              >
                {{ getBankLogo(gift.bank_name) }}
              </div>
              <div class="flex-1">
                <h4
                  class="text-xl font-bold text-gray-900 dark:text-white mb-1"
                >
                  {{ gift.bank_name }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ gift.account_holder }}
                </p>
              </div>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                @click="handleEdit(gift)"
                class="h-8 aspect-square bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-300"
                title="Edit"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button
                @click="openDeleteModal(gift)"
                class="h-8 aspect-square bg-gradient-to-br from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 hover:scale-105 active:scale-95 text-white rounded-lg transition-all duration-300"
                title="Hapus"
              >
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Nomor Rekening atau E-Wallet
                </p>
                <p
                  class="text-lg font-mono font-bold text-gray-900 dark:text-white tracking-wider"
                >
                  {{ gift.account_number }}
                </p>
              </div>
              <button
                @click="copyToClipboard(gift.account_number, 'Nomor rekening')"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                title="Salin nomor rekening"
              >
                <i class="bi bi-clipboard"></i>
                Salin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center mb-8 border-2 border-dashed border-blue-200 dark:border-blue-800"
    >
      <i class="bi bi-gift text-6xl text-blue-300 dark:text-blue-700"></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">
        Belum Ada Rekening Hadiah
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        Tambahkan rekening untuk menerima hadiah dari tamu
      </p>
    </div>

    <!-- Add/Edit Form Toggle Button -->
    <div class="mb-6">
      <button
        @click="toggleForm"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <i :class="ui.showForm ? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
        {{ ui.showForm ? "Batal" : "Tambah Rekening Baru" }}
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="ui.showForm">
      <div class="mb-6">
        <h3
          class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <i class="bi bi-bank text-blue-500"></i>
          {{ isEditMode ? "Edit Rekening" : "Tambah Rekening Baru" }}
        </h3>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <FormBaseInput
          v-model="formData.bank_name"
          type="text"
          label="Nama Bank atau e-wallet"
          placeholder="contoh: Bank BCA atau GoPay"
          :required="true"
          :error="validationErrors.bank_name"
          @input="handleInput('bank_name', formData.bank_name)"
        />

        <FormBaseInput
          v-model="formData.account_number"
          type="text"
          label="Nomor Rekening atau e-wallet"
          placeholder="contoh: 1234567890"
          :required="true"
          :error="validationErrors.account_number"
          @input="handleInput('account_number', formData.account_number)"
        />

        <FormBaseInput
          v-model="formData.account_holder"
          type="text"
          label="Nama Pemilik Rekening atau e-wallet"
          placeholder="contoh: John Doe"
          :required="true"
          :error="validationErrors.account_holder"
          @input="handleInput('account_holder', formData.account_holder)"
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
            class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            <span v-if="!ui.isSubmitting">
              {{ isEditMode ? "Perbarui Rekening" : "Simpan Rekening" }}
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
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        Lanjutkan
        <i class="bi bi-arrow-right ml-2"></i>
      </button>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
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
