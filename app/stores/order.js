import { defineStore } from "pinia";

export const useOrderStore = defineStore("order", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const fetchOrders = async () => {
    try {
      const response = await $fetch(`/api/orders/orders`, {
        method: "GET",
      });

      return response.data;
    } catch (error) {
      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  const {
    data: userOrders,
    error: userOrdersError,
    pending: userOrdersPending,
    refresh: userOrdersRefresh,
  } = useFetch(`/api/orders/user-orders`, {
    method: "GET",
    transform: (response) => {
      return response.data;
    },
  });

  const fetchOrder = async (orderId) => {
    try {
      const response = await $fetch(`/api/orders/${orderId}`, {
        method: "GET",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const getOrder = async (id) => {
    try {
      const response = await $fetch(`/api/orders/detail/${id}`, {
        method: "GET",
      });

      return response.data;
    } catch (error) {
      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  return {
    fetchOrders,

    userOrders,
    userOrdersError,
    userOrdersPending,
    userOrdersRefresh,
    // fetchUserOrders,

    fetchOrder,
    getOrder,
  };
});
