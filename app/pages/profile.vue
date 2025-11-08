<script setup>
definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  title: "EA Invitation - Profil",
  description:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogTitle: "EA Invitation - Profil",
  ogDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau. Pilih dari berbagai tema menarik dan bagikan kepada tamu undangan Anda dengan mudah.",
  ogImage: "/og-image.png",
  ogUrl: "/",
  twitterCard: "summary_large_image",
  twitterTitle: "EA Invitation - Profil",
  twitterDescription:
    "Buat undangan pernikahan digital yang indah, mudah, dan terjangkau.",
  twitterImage: "/og-image.png",
});

const { user } = storeToRefs(useAuthStore());

// Mock user data - replace with actual data from auth store
// const user = reactive({
//   name: "John Doe",
//   email: "john.doe@example.com",
//   phone: "+62 812-3456-7890",
//   avatar: null,
//   created_at: "2024-01-15",
//   totalInvitations: 12,
//   activeInvitations: 5,
//   completedInvitations: 7,
// });

const ui = reactive({
  isEditingProfile: false,
  isEditingPassword: false,
  isSubmitting: false,
  showSuccessAlert: false,
  showErrorAlert: false,
  alertMessage: "",
});

// Form data
const profileForm = reactive({
  name: user.name,
  email: user.email,
  phone: user.phone,
  avatar: null,
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Avatar preview
const avatarPreview = ref(user.avatar);

const completionRate = computed(() => {
  if (user.totalInvitations === 0) return 0;
  return Math.round((user.completedInvitations / user.totalInvitations) * 100);
});

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
    profileForm.name = user.name;
    profileForm.email = user.email;
    profileForm.phone = user.phone;
    profileForm.avatar = null;
    avatarPreview.value = user.avatar;
  }
};

const toggleEditPassword = () => {
  ui.isEditingPassword = !ui.isEditingPassword;
  if (!ui.isEditingPassword) {
    // Reset form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  }
};

const saveProfile = async () => {
  ui.isSubmitting = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update user data
    user.name = profileForm.name;
    user.email = profileForm.email;
    user.phone = profileForm.phone;
    if (profileForm.avatar) {
      user.avatar = avatarPreview.value;
    }

    showSuccess("Profil berhasil diperbarui!");
    ui.isEditingProfile = false;
  } catch (error) {
    showError("Gagal memperbarui profil");
  } finally {
    ui.isSubmitting = false;
  }
};

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showError("Password baru tidak cocok");
    return;
  }

  if (passwordForm.newPassword.length < 8) {
    showError("Password minimal 8 karakter");
    return;
  }

  ui.isSubmitting = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    showSuccess("Password berhasil diubah!");
    ui.isEditingPassword = false;
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (error) {
    showError("Gagal mengubah password");
  } finally {
    ui.isSubmitting = false;
  }
};

const showSuccess = (message) => {
  ui.alertMessage = message;
  ui.showSuccessAlert = true;
  setTimeout(() => {
    ui.showSuccessAlert = false;
  }, 3000);
};

const showError = (message) => {
  ui.alertMessage = message;
  ui.showErrorAlert = true;
  setTimeout(() => {
    ui.showErrorAlert = false;
  }, 3000);
};
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div class="max-w-6xl mx-auto space-y-4 md:space-y-6">
        <!-- Header -->
        <Header title="Profil Saya" :has-button="false" />

        <!-- Success Alert -->
        <div
          v-if="ui.showSuccessAlert"
          class="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3"
        >
          <i
            class="bi bi-check-circle-fill text-emerald-500 text-xl flex-shrink-0"
          ></i>
          <p class="text-sm text-emerald-700 dark:text-emerald-300 flex-1">
            {{ ui.alertMessage }}
          </p>
        </div>

        <!-- Error Alert -->
        <div
          v-if="ui.showErrorAlert"
          class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3"
        >
          <i
            class="bi bi-exclamation-circle-fill text-red-500 text-xl flex-shrink-0"
          ></i>
          <p class="text-sm text-red-700 dark:text-red-300 flex-1">
            {{ ui.alertMessage }}
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6">
          <!-- Left Column -->
          <div class="lg:col-span-1 space-y-4">
            <!-- Profile Card -->
            <div
              class="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <div class="text-center">
                <!-- Avatar -->
                <div class="relative inline-block mb-4">
                  <div
                    class="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700"
                  >
                    <NuxtImg
                      v-if="user.avatar"
                      :src="user.avatar"
                      alt="Avatar"
                      width="96"
                      height="96"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="bi bi-person text-slate-400 text-5xl"></i>
                  </div>
                  <div
                    v-if="ui.isEditingProfile"
                    class="absolute -bottom-2 -right-2 flex gap-2"
                  >
                    <label
                      class="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
                    >
                      <i class="bi bi-camera text-sm"></i>
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleAvatarChange"
                        class="hidden"
                      />
                    </label>
                    <button
                      v-if="avatarPreview"
                      @click="removeAvatar"
                      class="w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all active:scale-95"
                    >
                      <i class="bi bi-trash text-sm"></i>
                    </button>
                  </div>
                </div>

                <!-- User Info -->
                <h3
                  class="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1"
                >
                  {{ user.name }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {{ user.email }}
                </p>

                <!-- Member Badge -->
                <div
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 dark:bg-sky-950 rounded-full border border-sky-200 dark:border-sky-800"
                >
                  <i class="bi bi-award text-sky-500 text-sm"></i>
                  <span
                    class="text-xs font-medium text-slate-900 dark:text-slate-50"
                  >
                    Member sejak {{ formatDateToIndonesian(user.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Profile Information -->
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
                  <h4
                    class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                  >
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
                  <i
                    class="bi bi-person text-slate-400 flex-shrink-0 mt-0.5"
                  ></i>
                  <div class="flex-1">
                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Nama Lengkap
                    </p>
                    <p
                      class="text-sm font-medium text-slate-900 dark:text-slate-50"
                    >
                      {{ user.name }}
                    </p>
                  </div>
                </div>

                <!-- Email -->
                <div
                  class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <i
                    class="bi bi-envelope text-slate-400 flex-shrink-0 mt-0.5"
                  ></i>
                  <div class="flex-1">
                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Email
                    </p>
                    <p
                      class="text-sm font-medium text-slate-900 dark:text-slate-50"
                    >
                      {{ user.email }}
                    </p>
                  </div>
                </div>

                <!-- Phone -->
                <div
                  class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <i
                    class="bi bi-telephone text-slate-400 flex-shrink-0 mt-0.5"
                  ></i>
                  <div class="flex-1">
                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Nomor Telepon
                    </p>
                    <p
                      class="text-sm font-medium text-slate-900 dark:text-slate-50"
                    >
                      {{ user.phone }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Edit Form -->
              <form v-else @submit.prevent="saveProfile" class="space-y-4">
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

            <!-- Change Password -->
            <div
              class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
                  >
                    <i class="bi bi-shield-lock text-sky-500"></i>
                  </div>
                  <h4
                    class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                  >
                    Keamanan Akun
                  </h4>
                </div>
                <button
                  v-if="!ui.isEditingPassword"
                  @click="toggleEditPassword"
                  class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
                >
                  <i class="bi bi-key mr-1"></i>
                  Ubah Password
                </button>
              </div>

              <div
                v-if="!ui.isEditingPassword"
                class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
              >
                <div class="flex items-center gap-3">
                  <i class="bi bi-lock text-slate-400 text-xl"></i>
                  <div>
                    <p
                      class="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1"
                    >
                      Password Anda Aman
                    </p>
                    <p class="text-xs text-slate-600 dark:text-slate-300">
                      Terakhir diubah 30 hari yang lalu
                    </p>
                  </div>
                </div>
              </div>

              <!-- Change Password Form -->
              <form v-else @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label
                    class="block text-xs font-medium text-slate-900 dark:text-slate-50 mb-2"
                  >
                    Password Saat Ini <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    required
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="Masukkan password saat ini"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-medium text-slate-900 dark:text-slate-50 mb-2"
                  >
                    Password Baru <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    required
                    minlength="8"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="Minimal 8 karakter"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-medium text-slate-900 dark:text-slate-50 mb-2"
                  >
                    Konfirmasi Password Baru <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    required
                    minlength="8"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="Ulangi password baru"
                  />
                </div>

                <div
                  class="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-3"
                >
                  <div class="flex items-start gap-2">
                    <i
                      class="bi bi-info-circle text-amber-500 flex-shrink-0 mt-0.5"
                    ></i>
                    <p class="text-xs text-amber-700 dark:text-amber-300">
                      Password harus minimal 8 karakter dan mengandung kombinasi
                      huruf dan angka untuk keamanan maksimal.
                    </p>
                  </div>
                </div>

                <div class="flex gap-3 pt-3">
                  <button
                    type="button"
                    @click="toggleEditPassword"
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
                      Ubah Password
                    </span>
                    <span v-else class="flex items-center gap-2">
                      <div
                        class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      ></div>
                      Mengubah...
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Danger Zone -->
            <div
              class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-red-200 dark:border-red-800"
            >
              <div class="flex items-center gap-2 mb-4">
                <div
                  class="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center"
                >
                  <i class="bi bi-exclamation-triangle text-red-500"></i>
                </div>
                <h4
                  class="text-sm font-semibold text-slate-900 dark:text-slate-50"
                >
                  Zona Berbahaya
                </h4>
              </div>

              <div
                class="p-4 bg-red-50 dark:bg-red-950 rounded-2xl border border-red-200 dark:border-red-800"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p
                      class="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1"
                    >
                      Hapus Akun
                    </p>
                    <p class="text-xs text-slate-600 dark:text-slate-300">
                      Tindakan ini tidak dapat dibatalkan. Semua data Anda akan
                      dihapus permanen.
                    </p>
                  </div>
                  <button
                    class="flex-shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
                  >
                    Hapus Akun
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
