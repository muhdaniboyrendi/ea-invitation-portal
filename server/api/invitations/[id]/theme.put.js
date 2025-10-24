export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized: Anda harus login terlebih dahulu",
    });
  }

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  try {
    const response = await $fetch(`${apiBaseUrl}/invitations/${id}/theme`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body,
    });

    return response;
  } catch (error) {
    throw createError({
      statusCode: error.status || 500,
      message: error.data?.message || "Internal Server Error",
      data: { errors: error.data?.errors || error.data?.error || {} },
    });
  }
});
