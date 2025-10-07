// composables/useFileUpload.js
export const useFileUpload = (options = {}) => {
  const {
    allowedTypes = /^image\/(jpeg|jpg|png|webp)$/i,
    maxSize = 5 * 1024 * 1024, // 5MB
    onSuccess,
    onError,
  } = options;

  const fileInput = ref(null);
  const preview = ref(null);
  const isUpdated = ref(false);

  const validateFile = (file) => {
    if (!file) {
      onError?.("File tidak valid");
      return false;
    }

    if (!allowedTypes.test(file.type)) {
      onError?.("Format file tidak didukung");
      return false;
    }

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      onError?.(`Ukuran file maksimal ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return null;

    if (!validateFile(file)) {
      return null;
    }

    isUpdated.value = true;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
      onSuccess?.(file, e.target.result);
    };
    reader.readAsDataURL(file);

    return file;
  };

  const removeFile = () => {
    preview.value = null;
    isUpdated.value = true;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  const reset = () => {
    preview.value = null;
    isUpdated.value = false;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  const setPreview = (url) => {
    preview.value = url;
    isUpdated.value = false;
  };

  return {
    fileInput,
    preview,
    isUpdated,
    handleFileChange,
    removeFile,
    reset,
    setPreview,
  };
};
