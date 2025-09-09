export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, "auth_token");

  if (!authToken) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized: Anda harus login terlebih dahulu",
    });
  }

  const body = await readBody(event);

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  try {
    const response = await $fetch(`${apiBaseUrl}/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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
