<script setup>
const props = defineProps({
  invitationId: { type: [Number, String], required: true },
  maxImages: { type: Number, required: true },
  maxImagesText: { type: [Number, String], required: true },
  hasImageLimit: { type: Boolean, required: true },
});

const emit = defineEmits(["success", "error", "cancel"]);

const { createGalleries } = useGalleryStore();
const { compressImageToWebP, validateImage, ALLOWED_TYPES, MAX_SIZE } =
  useImageCompression();

const ui = reactive({
  isSubmitting: false,
});

const imageUpload = reactive({
  previews: [],
  files: [],
  originalFiles: [],
  errors: [],
  isDragging: false,
  isCompressing: false,
  compressionProgress: 0,
  currentCompressingFile: "",
});

const isFormValid = computed(() => {
  const hasFiles = imageUpload.files.length > 0;
  const withinLimit = props.hasImageLimit
    ? imageUpload.files.length <= props.maxImages
    : true;
  const noErrors = imageUpload.errors.length === 0;
  const notCompressing = !imageUpload.isCompressing;
  return hasFiles && withinLimit && noErrors && notCompressing;
});

const remainingSlots = computed(() => {
  if (!props.hasImageLimit) return Infinity;
  return props.maxImages - imageUpload.files.length;
});

const remainingSlotsText = computed(() => {
  if (!props.hasImageLimit) return "Tidak Terbatas";
  return `${remainingSlots.value} slot tersisa`;
});

const canAddMoreImages = computed(() => {
  if (!props.hasImageLimit) return true;
  return imageUpload.files.length < props.maxImages;
});

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files);
  processFiles(files);
};

const handleDrop = (event) => {
  imageUpload.isDragging = false;
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
};

const processFiles = async (files) => {
  imageUpload.errors = [];
  const totalCount = imageUpload.files.length + files.length;

  if (props.hasImageLimit && totalCount > props.maxImages) {
    imageUpload.errors.push(
      `Maksimal ${props.maxImages} foto. Anda sudah memiliki ${imageUpload.files.length} foto.`
    );
    return;
  }

  imageUpload.isCompressing = true;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    imageUpload.currentCompressingFile = file.name;
    imageUpload.compressionProgress = Math.round(
      ((i + 1) / files.length) * 100
    );

    const errors = validateImage(file);
    if (errors.length > 0) {
      imageUpload.errors.push(...errors);
      continue;
    }

    try {
      const compressedFile = await compressImageToWebP(file);

      // Validasi compressed file
      if (!compressedFile || compressedFile.size === 0) {
        imageUpload.errors.push(`${file.name}: Foto hasil kompresi kosong`);
        continue;
      }

      if (compressedFile.size > MAX_SIZE) {
        imageUpload.errors.push(
          `${file.name}: Foto masih terlalu besar setelah kompresi (maksimal 2MB)`
        );
        continue;
      }

      // Buat preview dengan Promise untuk memastikan selesai
      const previewUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          resolve(e.target.result);
        };

        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          reject(error);
        };

        reader.readAsDataURL(compressedFile);
      });

      // Hitung statistik
      const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);
      const compressionRatio = (
        (1 - compressedFile.size / file.size) *
        100
      ).toFixed(0);

      // Tambahkan preview
      imageUpload.previews.push({
        id: Date.now() + Math.random(),
        url: previewUrl,
        name: file.name,
        originalSize: originalSizeMB,
        compressedSize: compressedSizeMB,
        compressionRatio: compressionRatio,
      });

      // Tambahkan file setelah preview berhasil dibuat
      imageUpload.files.push(compressedFile);
      imageUpload.originalFiles.push(file);
    } catch (error) {
      console.error("Compression error:", error);
      imageUpload.errors.push(
        `${file.name}: ${error.message || "Gagal mengkompresi foto"}`
      );
    }
  }

  imageUpload.isCompressing = false;
  imageUpload.compressionProgress = 0;
  imageUpload.currentCompressingFile = "";

  if (imageUpload.errors.length > 0) {
    emit("error", imageUpload.errors.join("; "));
  }
};

const removeImage = (index) => {
  imageUpload.previews.splice(index, 1);
  imageUpload.files.splice(index, 1);
  imageUpload.originalFiles.splice(index, 1);
  imageUpload.errors = [];
};

const clearAllImages = () => {
  imageUpload.previews = [];
  imageUpload.files = [];
  imageUpload.originalFiles = [];
  imageUpload.errors = [];
};

const handleDragOver = (event) => {
  imageUpload.isDragging = true;
};

const handleDragLeave = (event) => {
  imageUpload.isDragging = false;
};

const submitForm = async () => {
  if (!isFormValid.value) {
    const limitText = props.hasImageLimit
      ? `maksimal ${props.maxImages} foto`
      : "foto";
    emit("error", `Mohon pilih minimal 1 foto (${limitText}).`);
    return;
  }
  if (ui.isSubmitting) return;

  ui.isSubmitting = true;

  try {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("invitation_id", props.invitationId);

    imageUpload.files.forEach((file, index) => {
      formDataToSubmit.append("images[]", file);
    });

    await createGalleries(formDataToSubmit);

    // Simpan count sebelum emit
    const uploadedCount = imageUpload.files.length;

    // Emit success dengan count SETELAH upload berhasil
    emit("success", uploadedCount);
  } catch (error) {
    console.error("Failed to upload images:", error);
    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Gagal mengunggah foto.";
    emit("error", message);
  } finally {
    ui.isSubmitting = false;
  }
};

const resetForm = () => {
  clearAllImages();
};

const handleCancel = () => {
  resetForm();
  emit("cancel");
};

// Cleanup blob URLs when component unmounts
onBeforeUnmount(() => {
  imageUpload.previews.forEach((preview) => {
    if (preview.url && preview.url.startsWith("blob:")) {
      URL.revokeObjectURL(preview.url);
    }
  });
});
</script>

<template>
  <div class="space-y-3 md:space-y-6">
    <!-- Compression Progress -->
    <UserInvitationFillGalleriesPhotoCompressionProgress
      v-if="imageUpload.isCompressing"
      :progress="imageUpload.compressionProgress"
      :current-file="imageUpload.currentCompressingFile"
    />

    <div
      class="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3 md:space-y-6"
    >
      <div class="flex items-center gap-2 mb-1 md:mb-4">
        <div
          class="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center"
        >
          <i class="bi bi-cloud-upload text-sky-500"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Unggah Foto
          <span class="text-xs text-slate-400 font-normal ml-1">
            (Maks {{ maxImagesText }})
          </span>
        </h3>
      </div>

      <div
        class="bg-sky-50 dark:bg-sky-950 rounded-2xl p-3 border border-sky-200 dark:border-sky-800"
      >
        <p class="text-xs text-sky-600 dark:text-sky-400">
          ✨ Foto akan otomatis dikonversi ke WebP untuk kualitas optimal
        </p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-3 md:space-y-6">
        <!-- Drop Zone -->
        <UserInvitationFillGalleriesPhotoDropZone
          :can-add-more="canAddMoreImages"
          :is-compressing="imageUpload.isCompressing"
          :is-dragging="imageUpload.isDragging"
          :remaining-slots-text="remainingSlotsText"
          :max-images-text="maxImagesText"
          @select="handleImageSelect"
          @drop="handleDrop"
          @drag-over="handleDragOver"
          @drag-leave="handleDragLeave"
        />

        <!-- Preview Grid -->
        <UserInvitationFillGalleriesPhotoPreviewGrid
          v-if="imageUpload.previews.length > 0"
          :previews="imageUpload.previews"
          :is-compressing="imageUpload.isCompressing"
          @remove="removeImage"
          @clear-all="clearAllImages"
        />

        <div class="flex gap-3 pt-3">
          <button
            type="button"
            @click="handleCancel"
            :disabled="ui.isSubmitting || imageUpload.isCompressing"
            class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
          >
            <i class="bi bi-x-lg text-lg"></i>
          </button>
          <button
            type="submit"
            :disabled="
              ui.isSubmitting || !isFormValid || imageUpload.isCompressing
            "
            class="flex-1 h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span v-if="!ui.isSubmitting && !imageUpload.isCompressing">
              <i class="bi bi-cloud-upload mr-1"></i>
              Unggah {{ imageUpload.files.length }} Foto
            </span>
            <span
              v-else-if="imageUpload.isCompressing"
              class="flex items-center gap-2"
            >
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Mengkompresi...
            </span>
            <span v-else class="flex items-center gap-2">
              <Spinner />
              Mengunggah...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
