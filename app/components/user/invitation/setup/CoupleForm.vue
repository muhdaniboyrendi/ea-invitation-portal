<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  validationErrors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "groom-input", "bride-input"]);

// Local computed for two-way binding
const invitationData = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleGroomInput = () => {
  emit("groom-input");
};

const handleBrideInput = () => {
  emit("bride-input");
};
</script>

<template>
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 md:p-8">
    <!-- Header -->
    <header class="mb-8">
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4 shadow-lg"
        >
          <i class="bi bi-heart-fill text-2xl text-white"></i>
        </div>
        <h2
          class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent mb-3"
        >
          Data Mempelai
        </h2>
        <p
          class="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto"
        >
          Lengkapi nama kedua mempelai untuk undangan pernikahan Anda
        </p>
      </div>
    </header>

    <!-- Form Content -->
    <div class="space-y-6">
      <!-- Groom and Bride Names -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Groom Name -->
        <div class="space-y-2">
          <FormBaseInput
            v-model="invitationData.groom"
            label="Nama Panggilan Mempelai Pria"
            placeholder="Contoh: Adam"
            :required="true"
            :error="validationErrors.groom"
            @input="handleGroomInput"
          />
        </div>

        <!-- Bride Name -->
        <div class="space-y-2">
          <FormBaseInput
            v-model="invitationData.bride"
            label="Nama Panggilan Mempelai Wanita"
            placeholder="Contoh: Hawa"
            :required="true"
            :error="validationErrors.bride"
            @input="handleBrideInput"
          />
        </div>
      </div>

      <!-- Theme ID Validation Error -->
      <div
        v-if="validationErrors.theme_id"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0"
          >
            <i
              class="bi bi-exclamation-triangle text-red-600 dark:text-red-400"
            ></i>
          </div>
          <div>
            <p class="text-red-800 dark:text-red-200 font-medium">
              Tema Belum Dipilih
            </p>
            <p class="text-red-600 dark:text-red-400 text-sm mt-1">
              {{ validationErrors.theme_id }}
            </p>
          </div>
        </div>
      </div>

      <!-- Info Card -->
      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0"
          >
            <i class="bi bi-info-circle text-blue-600 dark:text-blue-400"></i>
          </div>
          <div>
            <p class="text-blue-800 dark:text-blue-200 font-medium">
              Informasi Penting
            </p>
            <p class="text-blue-600 dark:text-blue-400 text-sm mt-1">
              Pastikan nama mempelai sudah benar. Data ini akan ditampilkan di
              undangan Anda dan dapat diubah nanti melalui menu edit undangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
