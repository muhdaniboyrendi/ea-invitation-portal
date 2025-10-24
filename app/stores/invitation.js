export const useInvitationStore = defineStore("invitation", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const {
    data: userInvitations,
    error: userInvitationsError,
    pending: userInvitationsPending,
    refresh: userInvitationsRefresh,
  } = useFetch(`/api/invitations/user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    transform: (response) => {
      return response.data;
    },
  });

  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const checkInvitation = async (orderId) => {
    try {
      const response = await $fetch(`/api/invitations/check/${orderId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const createInvitation = async (formData) => {
    try {
      const response = await $fetch(`/api/invitations/create`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const fetchInvitation = async (id) => {
    try {
      const response = await $fetch(`/api/invitations/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const completeInvitation = async (invitationId) => {
    try {
      const response = await $fetch(`/api/invitations/${invitationId}`, {
        method: "PUT",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateCouple = async (invitationId, coupleData) => {
    try {
      const response = await $fetch(`/api/invitations/${invitationId}/couple`, {
        method: "PUT",
        body: coupleData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateTheme = async (invitationId, themeId) => {
    try {
      const response = await $fetch(`/api/invitations/${invitationId}/theme`, {
        method: "PUT",
        body: { theme_id: themeId },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    userInvitations,
    userInvitationsError,
    userInvitationsPending,
    userInvitationsRefresh,
    checkInvitation,
    createInvitation,
    fetchInvitation,
    completeInvitation,
    updateCouple,
    updateTheme,
  };
});
