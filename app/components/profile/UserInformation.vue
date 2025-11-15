<script setup>
const { user } = storeToRefs(useAuthStore());
const { fetchUser } = useAuthStore();
const { updateUser } = useUserStore();

const ui = reactive({
  isEditingProfile: false,
  isSubmitting: false,
  showAlert: false,
  alertType: "success",
  alertMessage: "",
});

// Form data
const profileForm = reactive({
  name: user.value.name,
  email: user.value.email,
  phone: user.value.phone,
  avatar: null,
});

// Avatar preview
const avatarPreview = ref(user.value.avatar);

// Methods
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showError("Ukuran file maksimal 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showError("File harus berupa gambar");
      return;
    }

    profileForm.avatar = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeAvatar = () => {
  profileForm.avatar = null;
  avatarPreview.value = null;
};

const toggleEditProfile = () => {
  ui.isEditingProfile = !ui.isEditingProfile;
  if (!ui.isEditingProfile) {
    // Reset form
    profileForm.name = user.value.name;
    profileForm.email = user.value.email;
    profileForm.phone = user.value.phone;
    profileForm.avatar = null;
    avatarPreview.value = user.value.avatar;
  }
};

const saveProfile = async () => {
  ui.isSubmitting = true;
  try {
    await updateUser(profileForm);

    showSuccess("Profil berhasil diperbarui!");
    ui.isEditingProfile = false;
    fetchUser();
  } catch (error) {
    showError("Gagal memperbarui profil");
  } finally {
    ui.isSubmitting = false;
  }
};

const showSuccess = (message) => {
  ui.alertMessage = message;
  ui.alertType = "success";
  ui.showAlert = true;
};

const showError = (message) => {
  ui.alertMessage = message;
  ui.alertType = "error";
  ui.showAlert = true;
};

const handleCloseAlert = () => {
  ui.showAlert = false;
};
</script>

<template>
  <div class="space-y-4">
    <!-- Alert Notification -->
    <FormAlertNotification
      :type="ui.alertType"
      :message="ui.alertMessage"
      :show="ui.showAlert"
      :duration="3000"
      position="top-center"
      @close="handleCloseAlert"
    />

    <!-- Profile Information Card -->
    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
          >
            <i class="bi bi-person-badge text-sky-500"></i>
          </div>
          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Informasi Profil
          </h4>
        </div>
        <button
          v-if="!ui.isEditingProfile"
          @click="toggleEditProfile"
          class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
        >
          <i class="bi bi-pencil mr-1"></i>
          Edit
        </button>
      </div>

      <div v-if="!ui.isEditingProfile" class="space-y-4">
        <!-- Name -->
        <div
          class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <i class="bi bi-person text-slate-400 flex-shrink-0 mt-0.5"></i>
          <div class="flex-1">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Nama Lengkap
            </p>
            <p class="text-sm font-medium text-slate-900 dark:text-slate-50">
              {{ user.name }}
            </p>
          </div>
        </div>

        <!-- Email -->
        <div
          class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <i class="bi bi-envelope text-slate-400 flex-shrink-0 mt-0.5"></i>
          <div class="flex-1">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Email</p>
            <p class="text-sm font-medium text-slate-900 dark:text-slate-50">
              {{ user.email }}
            </p>
          </div>
        </div>

        <!-- Phone -->
        <div
          class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <i class="bi bi-telephone text-slate-400 flex-shrink-0 mt-0.5"></i>
          <div class="flex-1">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Nomor Telepon
            </p>
            <p class="text-sm font-medium text-slate-900 dark:text-slate-50">
              {{ user.phone }}
            </p>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <form v-else @submit.prevent="saveProfile" class="space-y-4">
        <!-- Avatar Upload (only for non-Google users) -->
        <div
          v-if="!user?.google_id"
          class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <div class="relative">
            <div
              class="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-600"
            >
              <NuxtImg
                v-if="avatarPreview"
                :src="avatarPreview"
                alt="Avatar Preview"
                width="80"
                height="80"
                class="w-full h-full object-cover"
              />
              <i v-else class="bi bi-person text-slate-400 text-4xl"></i>
            </div>
          </div>
          <div class="flex-1">
            <p
              class="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1"
            >
              Foto Profil
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Format: JPG, PNG. Maksimal 2MB
            </p>
            <div class="flex gap-2">
              <label
                class="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg cursor-pointer transition-all active:scale-95"
              >
                <i class="bi bi-upload mr-1"></i>
                Upload
                <input
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="hidden"
                />
              </label>
              <button
                v-if="avatarPreview"
                type="button"
                @click="removeAvatar"
                class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all active:scale-95"
              >
                <i class="bi bi-trash mr-1"></i>
                Hapus
              </button>
            </div>
          </div>
        </div>

        <div>
          <label
            class="block text-xs font-medium text-slate-900 dark:text-slate-50 mb-2"
          >
            Nama Lengkap <span class="text-red-500">*</span>
          </label>
          <input
            v-model="profileForm.name"
            type="text"
            required
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div>
          <label
            class="block text-xs font-medium text-slate-900 dark:text-slate-50 mb-2"
          >
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="profileForm.email"
            type="email"
            required
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label
            class="block text-xs font-medium text-slate-900 dark:text-slate-50 mb-2"
          >
            Nomor Telepon
          </label>
          <input
            v-model="profileForm.phone"
            type="tel"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            placeholder="+62 812-3456-7890"
          />
        </div>

        <div class="flex gap-3 pt-3">
          <button
            type="button"
            @click="toggleEditProfile"
            :disabled="ui.isSubmitting"
            class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
          >
            <i class="bi bi-x-lg text-lg"></i>
          </button>
          <button
            type="submit"
            :disabled="ui.isSubmitting"
            class="flex-1 h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span v-if="!ui.isSubmitting">
              <i class="bi bi-check-circle mr-1"></i>
              Simpan Perubahan
            </span>
            <span v-else class="flex items-center gap-2">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Menyimpan...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
