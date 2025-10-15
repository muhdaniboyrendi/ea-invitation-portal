export const useInvitationStore = defineStore("invitation", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  // const {
  //   data: invitations,
  //   error: invitationsError,
  //   pending: invitationsPending,
  //   refresh: invitationsRefresh,
  // } = useFetch(`${apiBaseUrl}/invitations`, {
  //   method: "GET",
  //   headers: {
  //     Accept: "application/json",
  //   },
  //   transform: (response) => {
  //     return response.data;
  //   },
  // });

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
      const response = await $fetch(`${apiBaseUrl}/invitations/${id}`, {
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

  const updateInvitation = async (invitationId, invitationData) => {
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("name", invitationData.name);
    formData.append("artist", invitationData.artist);

    if (invitationData.audio) {
      formData.append("audio", invitationData.audio);
    }

    if (invitationData.thumbnail) {
      formData.append("thumbnail", invitationData.thumbnail);
    }

    try {
      const response = await $fetch(`/api/invitations/${invitationId}`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteInvitation = async (invitationId) => {
    try {
      const response = await $fetch(`/api/invitations/${invitationId}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    // invitations,
    // invitationsError,
    // invitationsPending,
    // invitationsRefresh,
    userInvitations,
    userInvitationsError,
    userInvitationsPending,
    userInvitationsRefresh,
    fetchInvitation,
    createInvitation,
    updateInvitation,
    deleteInvitation,
  };
});
