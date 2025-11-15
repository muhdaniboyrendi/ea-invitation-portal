<script setup>
const ui = reactive({
  isEditingPassword: false,
  isSubmitting: false,
  showSuccessAlert: false,
  showErrorAlert: false,
  alertMessage: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const toggleEditPassword = () => {
  ui.isEditingPassword = !ui.isEditingPassword;
  if (!ui.isEditingPassword) {
    // Reset form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
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
  <div class="space-y-4">
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

    <!-- Change Password Card -->
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
          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
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
              Password harus minimal 8 karakter dan mengandung kombinasi huruf
              dan angka untuk keamanan maksimal.
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
  </div>
</template>
