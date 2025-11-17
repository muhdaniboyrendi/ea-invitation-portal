export const useImageCompression = () => {
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  // Pengaturan kompresi - maksimal resolusi
  const COMPRESSION_SETTINGS = {
    maxWidth: 1920, // Full HD width
    maxHeight: 1920, // Full HD height (square support)
    quality: 0.92, // Kualitas tinggi untuk WebP (0-1)
    format: "image/webp", // Output format
  };

  const validateImage = (file) => {
    const errors = [];

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: Format tidak didukung (hanya JPG, PNG, WEBP)`);
    }

    return errors;
  };

  const compressImageToWebP = async (file) => {
    return new Promise((resolve, reject) => {
      // Buat image element untuk load file
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: true });

      img.onload = () => {
        try {
          // Hitung dimensi baru dengan mempertahankan aspect ratio
          let width = img.width;
          let height = img.height;
          const aspectRatio = width / height;

          // Resize jika melebihi maksimal dimensi
          if (
            width > COMPRESSION_SETTINGS.maxWidth ||
            height > COMPRESSION_SETTINGS.maxHeight
          ) {
            if (aspectRatio > 1) {
              // Landscape atau square
              width = Math.min(width, COMPRESSION_SETTINGS.maxWidth);
              height = Math.round(width / aspectRatio);
            } else {
              // Portrait
              height = Math.min(height, COMPRESSION_SETTINGS.maxHeight);
              width = Math.round(height * aspectRatio);
            }
          }

          // Set canvas size
          canvas.width = width;
          canvas.height = height;

          // Draw image ke canvas dengan smoothing untuk kualitas terbaik
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to WebP blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Gagal mengkonversi gambar ke WebP"));
                return;
              }

              // Validasi hasil kompresi
              if (blob.size === 0) {
                reject(new Error("Hasil konversi kosong"));
                return;
              }

              // Buat File object dari blob
              const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const webpFile = new File([blob], fileName, {
                type: COMPRESSION_SETTINGS.format,
                lastModified: Date.now(),
              });

              // Cleanup
              URL.revokeObjectURL(img.src);

              resolve(webpFile);
            },
            COMPRESSION_SETTINGS.format,
            COMPRESSION_SETTINGS.quality
          );
        } catch (error) {
          console.error("Image processing error:", error);
          URL.revokeObjectURL(img.src);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error("Image load error:", error);
        URL.revokeObjectURL(img.src);
        reject(new Error("Gagal memuat gambar"));
      };

      // Load image dari file
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
    });
  };

  return {
    MAX_SIZE,
    ALLOWED_TYPES,
    COMPRESSION_SETTINGS,
    validateImage,
    compressImageToWebP,
  };
};
