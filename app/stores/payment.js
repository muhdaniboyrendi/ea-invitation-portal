export const usePaymentStore = defineStore("payment", () => {
  const config = useRuntimeConfig();
  const { userOrdersRefresh } = useOrderStore();

  const apiBaseUrl = config.public.apiBaseUrl;

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

      userOrdersRefresh();

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

      userOrdersRefresh();

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const getUserOrder = async () => {
    try {
      const res = await $fetch(`${apiBaseUrl}/payments/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const getOrderStatus = async (orderId) => {
    try {
      const res = await $fetch(`${apiBaseUrl}/payments/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    createPayment,
    updatePaymentSuccess,
    updatePaymentCanceled,
    getUserOrder,
    getOrderStatus,
  };
});
