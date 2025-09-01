export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");

  // if (!token) {
  //   // throw createError({
  //   //   statusCode: 401,
  //   //   message: "Unauthorized",
  //   // });
  //   return {
  //     status: false,
  //     message: "Unauthorized",
  //     data: { user: null },
  //   };
  // }

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  try {
    const response = await $fetch(`${apiBaseUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return response;
  } catch (error) {
    // Hapus cookie hanya jika benar-benar unauthorized (401)
    if (error.status === 401) {
      deleteCookie(event, "auth_token", {
        path: "/",
        httpOnly: true,
      });
    }

    throw createError({
      statusCode: error.status || 500,
      message: error.data?.message || "Internal Server Error",
      data: { errors: error.data?.errors || error.data?.error || {} },
    });
  }
});
