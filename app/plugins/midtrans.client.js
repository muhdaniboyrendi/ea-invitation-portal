export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const midtransClientKey = config.public.midtransClientKey;

  const loadMidtransScript = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("midtrans-script")) {
        if (window.snap) {
          resolve();
        } else {
          const checkSnap = setInterval(() => {
            if (window.snap) {
              clearInterval(checkSnap);
              resolve();
            }
          }, 100);

          setTimeout(() => {
            clearInterval(checkSnap);
            reject(new Error("Snap tidak tersedia setelah script dimuat"));
          }, 5000);
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "midtrans-script";
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", midtransClientKey);

      script.onload = () => {
        const checkSnap = setInterval(() => {
          if (window.snap) {
            clearInterval(checkSnap);
            resolve();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkSnap);
          reject(new Error("Snap tidak tersedia setelah script dimuat"));
        }, 5000);
      };

      script.onerror = () => {
        reject(new Error("Gagal memuat script Midtrans"));
      };

      document.head.appendChild(script);
    });
  };

  const openSnapPayment = (snapToken, callbacks) => {
    const defaultCallbacks = {
      onSuccess: (result) => {
        console.log("Payment success:", result);
      },
      onPending: (result) => {
        console.log("Payment pending:", result);
      },
      onError: (result) => {
        console.error("Payment error:", result);
      },
      onClose: () => {
        console.log("Payment popup closed without finishing");
      },
    };

    const finalCallbacks = { ...defaultCallbacks, ...callbacks };

    if (typeof window.snap === "undefined") {
      loadMidtransScript()
        .then(() => {
          window.snap.pay(snapToken, finalCallbacks);
        })
        .catch((error) => {
          console.error("Error loading Midtrans script:", error);
          if (callbacks.onError) {
            callbacks.onError({ status_message: error.message });
          }
        });
    } else {
      window.snap.pay(snapToken, finalCallbacks);
    }
  };

  return {
    provide: {
      midtrans: {
        loadScript: loadMidtransScript,
        openSnapPayment: openSnapPayment,
      },
    },
  };
});
