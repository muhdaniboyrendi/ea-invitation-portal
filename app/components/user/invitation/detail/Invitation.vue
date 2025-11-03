<script setup>
const { updateCouple } = useInvitationStore();
const config = useRuntimeConfig();
const mainAppUrl = config.public.mainAppUrl;

const props = defineProps(["invitationData"]);
const emit = defineEmits(["updated"]);

const isEditMode = ref(false);
const isSaving = ref(false);

// Alert state
const alert = reactive({
  show: false,
  type: "info",
  message: "",
});

// Menggunakan reactive untuk formData
const formData = reactive({
  groom_name: props.invitationData.groom_name,
  bride_name: props.invitationData.bride_name,
});

const errors = reactive({
  groom_name: "",
  bride_name: "",
});

const showAlert = (type, message) => {
  alert.show = true;
  alert.type = type;
  alert.message = message;
};

const closeAlert = () => {
  alert.show = false;
};

const validateField = (field) => {
  errors[field] = "";

  const value = formData[field];

  if (!value || value.trim() === "") {
    errors[field] = `${
      field === "groom_name" ? "Nama mempelai pria" : "Nama mempelai wanita"
    } wajib diisi`;
    return false;
  }

  if (value.trim().length < 2) {
    errors[field] = "Nama minimal 2 karakter";
    return false;
  }

  if (value.trim().length > 100) {
    errors[field] = "Nama maksimal 100 karakter";
    return false;
  }

  return true;
};

const validateForm = () => {
  const isGroomValid = validateField("groom_name");
  const isBrideValid = validateField("bride_name");
  return isGroomValid && isBrideValid;
};

const toggleEditMode = () => {
  if (isEditMode.value) {
    // Reset form data
    formData.groom_name = props.invitationData.groom_name;
    formData.bride_name = props.invitationData.bride_name;

    // Reset errors
    errors.groom_name = "";
    errors.bride_name = "";
  }
  isEditMode.value = !isEditMode.value;
};

const saveChanges = async () => {
  if (!validateForm()) {
    showAlert("error", "Mohon periksa kembali form yang Anda isi");
    return;
  }

  isSaving.value = true;

  try {
    await updateCouple(props.invitationData.id, {
      groom_name: formData.groom_name,
      bride_name: formData.bride_name,
    });

    showAlert("success", "Data mempelai berhasil diperbarui");

    setTimeout(() => {
      isEditMode.value = false;
      emit("updated");
    }, 5000);
  } catch (error) {
    console.error("Error saving data:", error);
    showAlert("error", "Gagal menyimpan data. Silakan coba lagi");
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Alert Notification -->
    <FormAlertNotification
      :show="alert.show"
      :type="alert.type"
      :message="alert.message"
      position="top-center"
      :duration="5000"
      @close="closeAlert"
    />

    <div
      class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
    >
      <div class="relative p-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between mb-6 gap-y-6">
          <div class="flex items-center space-x-3 flex-1">
            <div
              class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <i class="bi bi-heart-fill text-white text-xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-600 dark:text-slate-300">
                The Wedding of
              </p>

              <!-- Display Mode -->
              <div v-if="!isEditMode" class="flex items-center gap-2">
                <h3
                  class="text-xl font-bold text-slate-900 dark:text-slate-50 truncate"
                >
                  {{ props.invitationData.groom_name }} &
                  {{ props.invitationData.bride_name }}
                </h3>
                <button
                  @click="toggleEditMode"
                  class="p-1.5 text-slate-400 hover:text-sky-500 transition-colors flex-shrink-0"
                  title="Edit nama"
                >
                  <i class="bi bi-pencil-square text-sm"></i>
                </button>
              </div>

              <!-- Edit Mode -->
              <div v-else class="mt-2">
                <p
                  class="text-xs text-sky-600 dark:text-sky-400 mb-2 flex items-center gap-1"
                >
                  <i class="bi bi-info-circle"></i>
                  Sedang mengedit nama mempelai
                </p>
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div
            :class="{
              'w-fit h-fit bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 border border-amber-200 dark:border-amber-700':
                props.invitationData.status === 'draft',
              'w-fit h-fit bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 border border-emerald-200 dark:border-emerald-700':
                props.invitationData.status === 'published',
              'w-fit h-fit bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 border border-red-200 dark:border-red-700':
                props.invitationData.status === 'expired',
            }"
            class="px-4 py-1 rounded-full flex-shrink-0"
          >
            <span
              :class="{
                'text-amber-700 dark:text-amber-300':
                  props.invitationData.status === 'draft',
                'text-emerald-700 dark:text-emerald-300':
                  props.invitationData.status === 'published',
                'text-red-700 dark:text-red-300':
                  props.invitationData.status === 'expired',
              }"
              class="text-sm font-semibold"
            >
              {{
                props.invitationData.status === "draft"
                  ? "Belum Aktif"
                  : props.invitationData.status === "published"
                  ? "Aktif"
                  : "Kadaluarsa"
              }}
            </span>
          </div>
        </div>

        <!-- Edit Form -->
        <Transition name="slide-fade">
          <div
            v-if="isEditMode"
            class="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormBaseInput
                v-model="formData.groom_name"
                label="Nama Mempelai Pria"
                placeholder="Masukkan nama mempelai pria"
                required
                :error="errors.groom_name"
                :disabled="isSaving"
                @input="validateField('groom_name')"
                @blur="validateField('groom_name')"
              />

              <FormBaseInput
                v-model="formData.bride_name"
                label="Nama Mempelai Wanita"
                placeholder="Masukkan nama mempelai wanita"
                required
                :error="errors.bride_name"
                :disabled="isSaving"
                @input="validateField('bride_name')"
                @blur="validateField('bride_name')"
              />
            </div>

            <div class="flex gap-3">
              <button
                @click="saveChanges"
                :disabled="isSaving"
                class="flex-1 py-2.5 px-4 flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <i v-if="!isSaving" class="bi bi-check-lg text-sm"></i>
                <Spinner v-else />
                <span>{{ isSaving ? "Menyimpan..." : "Simpan" }}</span>
              </button>

              <button
                @click="toggleEditMode"
                :disabled="isSaving"
                class="flex-1 py-2.5 px-4 flex justify-center items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <i class="bi bi-x-lg text-sm"></i>
                <span>Batal</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Dates Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div
            class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
          >
            <div class="flex items-center space-x-3">
              <div
                class="h-8 w-8 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl flex justify-center items-center flex-shrink-0"
              >
                <i class="bi bi-calendar-plus text-white text-sm"></i>
              </div>
              <div class="text-start">
                <p class="text-xs text-slate-600 dark:text-slate-300">Dibuat</p>
                <p
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                >
                  {{ formatDateToIndonesian(props.invitationData.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-700/50"
          >
            <div class="flex items-center space-x-3">
              <div
                class="h-8 w-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex justify-center items-center flex-shrink-0"
              >
                <i class="bi bi-calendar-x text-white text-sm"></i>
              </div>
              <div class="text-start">
                <p class="text-xs text-slate-600 dark:text-slate-300">
                  Kadaluarsa
                </p>
                <p
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                >
                  {{ formatDateToIndonesian(props.invitationData.expiry_date) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="w-full flex flex-col sm:flex-row gap-x-6 gap-y-4">
          <NuxtLink
            :to="`/invitation/fill/${props.invitationData.id}`"
            class="w-full py-3 px-6 flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <i class="bi bi-pencil text-sm"></i>
            <span class="block">Edit Data</span>
          </NuxtLink>

          <a
            v-if="props.invitationData.slug"
            :href="`${mainAppUrl}/${props.invitationData.slug}`"
            target="_blank"
            class="w-full py-3 px-6 flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <i class="bi bi-box-arrow-up-right text-sm"></i>
            <span class="block">Preview Undangan</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Slide fade animation */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
