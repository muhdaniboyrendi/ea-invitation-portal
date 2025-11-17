export const useVideoCompression = () => {
  const MAX_SIZE = 150 * 1024 * 1024;
  const ALLOWED_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ];

  const COMPRESSION_SETTINGS = {
    maxWidth: 1920,
    maxHeight: 1080,
    targetVideoBitrate: 2500000,
    targetAudioBitrate: 128000,
    frameRate: 30,
    quality: 0.8,
  };

  const validateVideo = (file) => {
    const errors = [];
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(
        `${file.name}: Format tidak didukung (hanya MP4, WEBM, OGG, MOV)`
      );
    }
    return errors;
  };

  const compressVideoWithAudio = async (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.crossOrigin = "anonymous";
      video.playsInline = true;

      video.onloadedmetadata = async () => {
        try {
          // Skip compression jika file sudah kecil (di bawah 15MB)
          if (file.size < 15 * 1024 * 1024) {
            URL.revokeObjectURL(video.src);
            resolve(file);
            return;
          }

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", { alpha: false });

          // Calculate dimensions dengan mempertahankan aspect ratio
          let width = video.videoWidth;
          let height = video.videoHeight;
          const aspectRatio = width / height;

          // Resize jika melebihi Full HD
          if (width > COMPRESSION_SETTINGS.maxWidth) {
            width = COMPRESSION_SETTINGS.maxWidth;
            height = Math.round(width / aspectRatio);
          }
          if (height > COMPRESSION_SETTINGS.maxHeight) {
            height = COMPRESSION_SETTINGS.maxHeight;
            width = Math.round(height * aspectRatio);
          }

          // Pastikan dimensi genap
          width = Math.round(width / 2) * 2;
          height = Math.round(height / 2) * 2;

          canvas.width = width;
          canvas.height = height;

          const chunks = [];
          let audioContext = null;
          let sourceNode = null;
          let destination = null;

          // Setup video stream dari canvas
          const videoStream = canvas.captureStream(
            COMPRESSION_SETTINGS.frameRate
          );

          // Setup audio stream
          try {
            audioContext = new (window.AudioContext ||
              window.webkitAudioContext)();
            sourceNode = audioContext.createMediaElementSource(video);
            destination = audioContext.createMediaStreamDestination();
            sourceNode.connect(destination);
          } catch (audioError) {
            console.warn(
              "Audio setup failed, continuing without audio:",
              audioError
            );
          }

          // Gabungkan video dan audio streams
          const streams = [...videoStream.getVideoTracks()];
          if (destination && destination.stream.getAudioTracks().length > 0) {
            streams.push(...destination.stream.getAudioTracks());
          }
          const combinedStream = new MediaStream(streams);

          // Check browser support untuk codec
          const mimeType = MediaRecorder.isTypeSupported(
            "video/webm;codecs=vp9,opus"
          )
            ? "video/webm;codecs=vp9,opus"
            : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
            ? "video/webm;codecs=vp8,opus"
            : MediaRecorder.isTypeSupported("video/webm")
            ? "video/webm"
            : "video/mp4";

          const mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: mimeType,
            videoBitsPerSecond: COMPRESSION_SETTINGS.targetVideoBitrate,
            audioBitsPerSecond: COMPRESSION_SETTINGS.targetAudioBitrate,
          });

          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              chunks.push(e.data);
            }
          };

          mediaRecorder.onstop = () => {
            // Pastikan ada data
            if (chunks.length === 0) {
              reject(new Error("Tidak ada data video yang terekam"));
              return;
            }

            const blob = new Blob(chunks, { type: mimeType });

            // Validasi blob size
            if (blob.size === 0) {
              reject(new Error("Video hasil kompresi kosong"));
              return;
            }

            const fileName =
              file.name.replace(/\.[^/.]+$/, "") + "_compressed.webm";
            const compressedFile = new File([blob], fileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            // Cleanup
            videoStream.getTracks().forEach((track) => track.stop());
            if (destination) {
              destination.stream.getTracks().forEach((track) => track.stop());
            }
            if (audioContext && audioContext.state !== "closed") {
              audioContext.close();
            }
            URL.revokeObjectURL(video.src);
            video.remove();

            resolve(compressedFile);
          };

          mediaRecorder.onerror = (error) => {
            console.error("MediaRecorder error:", error);
            // Cleanup on error
            videoStream.getTracks().forEach((track) => track.stop());
            if (destination) {
              destination.stream.getTracks().forEach((track) => track.stop());
            }
            if (audioContext && audioContext.state !== "closed") {
              audioContext.close();
            }
            reject(error);
          };

          // Start recording
          mediaRecorder.start(100);

          // Play video SETELAH recording dimulai
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Play error:", error);
              reject(new Error("Gagal memutar video"));
            });
          }

          // Draw frames dengan frame rate yang konsisten
          const frameInterval = 1000 / COMPRESSION_SETTINGS.frameRate;
          let lastFrameTime = performance.now();
          let animationId = null;

          const drawFrame = (currentTime) => {
            if (video.paused || video.ended) {
              return;
            }

            if (currentTime - lastFrameTime >= frameInterval) {
              ctx.drawImage(video, 0, 0, width, height);
              lastFrameTime = currentTime;
            }

            animationId = requestAnimationFrame(drawFrame);
          };

          video.onended = () => {
            if (animationId) {
              cancelAnimationFrame(animationId);
            }
            setTimeout(() => {
              if (mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
              }
            }, 200); // Tambah delay untuk ensure semua data tercapture
          };

          // Start drawing frames
          animationId = requestAnimationFrame(drawFrame);
        } catch (error) {
          console.error("Compression error:", error);
          URL.revokeObjectURL(video.src);
          reject(error);
        }
      };

      video.onerror = (error) => {
        console.error("Video load error:", error);
        URL.revokeObjectURL(video.src);
        reject(new Error("Gagal memuat video"));
      };

      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      video.load();
    });
  };

  return {
    MAX_SIZE,
    ALLOWED_TYPES,
    COMPRESSION_SETTINGS,
    validateVideo,
    compressVideoWithAudio,
  };
};
