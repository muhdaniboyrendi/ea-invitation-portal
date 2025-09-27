// server/api/themes/create.post.js
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

  const formData = await readMultipartFormData(event);

  if (!formData) {
    throw createError({
      statusCode: 400,
      message: "No form data received",
    });
  }

  const body = new FormData();

  formData.forEach((field) => {
    if (field.name) {
      if (field.filename) {
        const blob = new Blob([field.data], { type: field.type });
        body.append(field.name, blob, field.filename);
      } else {
        body.append(field.name, field.data.toString());
      }
    }
  });

  try {
    const response = await $fetch(`${apiBaseUrl}/themes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body,
    });

    console.log("Laravel API response:", response);

    return response;
  } catch (error) {
    console.error("Laravel API error:", error);
    
    throw createError({
      statusCode: error.status || 500,
      message: error.data?.message || "Internal Server Error",
      data: { errors: error.data?.errors || error.data?.error || {} },
    });
  }
});
