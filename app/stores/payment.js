import { defineStore } from "pinia";

export const usePaymentStore = defineStore("payment", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const currentOrder = ref(null);
  const orderHistory = ref([]);
  const paymentLoading = ref(false);
  const paymentError = ref(null);
  const paymentSuccess = ref(false);

  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const createPayment = async (packageId) => {
    try {
      const response = await $fetch(`/api/payments/create`, {
        method: "POST",
        body: { package_id: packageId },
      });

      currentOrder.value = response.data;

      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updatePaymentSuccess = async (orderId) => {
    try {
      const response = await $fetch(`/api/payments/${orderId}/success`, {
        method: "PUT",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updatePaymentCanceled = async (orderId) => {
    try {
      const response = await $fetch(`/api/payments/${orderId}/cancel`, {
        method: "PUT",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const getUserOrder = async () => {
    try {
      paymentLoading.value = true;
      paymentError.value = null;

      const res = await $fetch(`${apiBaseUrl}/payments/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status) {
        orderHistory.value = res.data;

        return res.data;
      } else {
        paymentError.value = res.message || "Gagal mendapatkan riwayat pesanan";
        return [];
      }
    } catch (error) {
      paymentError.value =
        error.message ||
        "Terjadi kesalahan saat mendapatkan riwayat pembayaran";
      return null;
    } finally {
      paymentLoading.value = false;
    }
  };

  const getOrderStatus = async (orderId) => {
    try {
      paymentLoading.value = true;
      paymentError.value = null;

      const res = await $fetch(`${apiBaseUrl}/payments/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status) {
        return res.data;
      }
    } catch (error) {
      paymentError.value =
        error.message ||
        "Terjadi kesalahan saat mendapatkan riwayat pembayaran";
      return null;
    } finally {
      paymentLoading.value = false;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      paymentLoading.value = true;
      paymentError.value = null;

      const res = await $fetch(
        `${apiBaseUrl}/payments/orders/${orderId}/cancel/${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status) {
        return true;
      }
    } catch (error) {
      paymentError.value =
        error.message || "Terjadi kesalahan saat membatalkan pesanan";
      return false;
    } finally {
      paymentLoading.value = false;
    }
  };

  function updatePaymentStatus(orderId, status) {
    if (currentOrder.value && currentOrder.value.order_id === orderId) {
      currentOrder.value.payment_status = status;
    }
  }

  const resetPaymentState = () => {
    currentOrder.value = null;
    paymentError.value = null;
    paymentSuccess.value = false;
  };

  return {
    currentOrder,
    orderHistory,
    paymentLoading,
    paymentError,
    paymentSuccess,
    createPayment,
    updatePaymentSuccess,
    updatePaymentCanceled,
    getUserOrder,
    getOrderStatus,
    cancelOrder,
    updatePaymentStatus,
    resetPaymentState,
  };
});
