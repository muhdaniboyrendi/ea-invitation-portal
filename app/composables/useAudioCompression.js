export const useAudioCompression = () => {
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_TYPES = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/m4a",
    "audio/x-m4a",
    "audio/mp4",
  ];

  // Pengaturan kompresi audio
  const COMPRESSION_SETTINGS = {
    audioBitrate: 128000, // 128 kbps - kualitas baik untuk musik
    sampleRate: 44100, // 44.1 kHz - standard CD quality
    numberOfChannels: 2, // Stereo
    format: "audio/mp3", // Output format
  };

  const validateAudio = (file) => {
    const errors = [];

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`Format tidak didukung. Gunakan MP3, WAV, OGG, atau M4A`);
    }

    // Check untuk file yang sangat besar
    if (file.size > 100 * 1024 * 1024) {
      // 100MB
      errors.push(`File terlalu besar. Maksimal 100MB`);
    }

    return errors;
  };

  const getAudioDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        resolve(audio.duration);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audio.src);
        reject(new Error("Gagal membaca metadata audio"));
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  const compressAudio = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Untuk file yang sudah kecil (<5MB), skip compression
        if (file.size < 5 * 1024 * 1024) {
          console.log("Audio file is already small, skipping compression");
          resolve(file);
          return;
        }

        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            // Decode audio data
            const arrayBuffer = e.target.result;
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Check browser support untuk MediaRecorder
            const mimeType = MediaRecorder.isTypeSupported(
              "audio/webm;codecs=opus"
            )
              ? "audio/webm;codecs=opus"
              : MediaRecorder.isTypeSupported("audio/mp4")
              ? "audio/mp4"
              : "audio/webm";

            // Create offline context untuk re-encode dengan bitrate lebih rendah
            const offlineContext = new OfflineAudioContext(
              COMPRESSION_SETTINGS.numberOfChannels,
              audioBuffer.length,
              COMPRESSION_SETTINGS.sampleRate
            );

            // Create buffer source
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start(0);

            // Render audio
            const renderedBuffer = await offlineContext.startRendering();

            // Convert to MediaStream for recording
            const mediaStreamDestination =
              audioContext.createMediaStreamDestination();
            const mediaSource = audioContext.createBufferSource();
            mediaSource.buffer = renderedBuffer;
            mediaSource.connect(mediaStreamDestination);

            // Record dengan MediaRecorder
            const mediaRecorder = new MediaRecorder(
              mediaStreamDestination.stream,
              {
                mimeType: mimeType,
                audioBitsPerSecond: COMPRESSION_SETTINGS.audioBitrate,
              }
            );

            const chunks = [];

            mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) {
                chunks.push(e.data);
              }
            };

            mediaRecorder.onstop = () => {
              const blob = new Blob(chunks, { type: mimeType });

              if (blob.size === 0) {
                reject(new Error("Hasil kompresi kosong"));
                return;
              }

              const extension = mimeType.includes("webm") ? ".webm" : ".mp4";
              const fileName =
                file.name.replace(/\.[^/.]+$/, "") + "_compressed" + extension;
              const compressedFile = new File([blob], fileName, {
                type: mimeType,
                lastModified: Date.now(),
              });

              // Cleanup
              audioContext.close();

              resolve(compressedFile);
            };

            mediaRecorder.onerror = (error) => {
              console.error("MediaRecorder error:", error);
              audioContext.close();
              reject(error);
            };

            // Start recording
            mediaRecorder.start(100);
            mediaSource.start(0);

            // Stop setelah audio selesai
            setTimeout(() => {
              if (mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
              }
            }, renderedBuffer.duration * 1000 + 500);
          } catch (error) {
            console.error("Audio decoding error:", error);
            audioContext.close();
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error("Gagal membaca file audio"));
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Audio compression error:", error);
        // Jika kompresi gagal, gunakan file original
        resolve(file);
      }
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    MAX_SIZE,
    ALLOWED_TYPES,
    COMPRESSION_SETTINGS,
    validateAudio,
    compressAudio,
    getAudioDuration,
    formatDuration,
  };
};
