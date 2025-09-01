<script setup>
const { handleGoogleCallback } = useAuthStore();
const route = useRoute();

onMounted(async () => {
  if (route.query.code) {
    try {
      handleGoogleCallback(route.query.code);
    } catch (error) {
      console.error("Failed to process authentication callback:", error);
      navigateTo(
        "/login?error=" +
          encodeURIComponent(error.message || "Authentication failed")
      );
    }
  } else {
    navigateTo(
      "/login?error=" + encodeURIComponent("Authentication data missing")
    );
  }
});
</script>

<template>
  <div>
    <NuxtLayout name="auth">
      <div
        class="relative w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex items-center justify-center"
      >
        <!-- Animated background elements -->
        <div class="absolute inset-0">
          <!-- Grid pattern overlay -->
          <div
            class="absolute inset-0 opacity-5"
            style="
              background-image: radial-gradient(
                circle at 1px 1px,
                rgba(255, 255, 255, 0.15) 1px,
                transparent 0
              );
              background-size: 50px 50px;
            "
          ></div>
        </div>

        <!-- Main content container -->
        <div class="relative z-10 w-full max-w-lg mx-auto px-6">
          <!-- Glass morphism container -->
          <div
            class="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl overflow-hidden"
          >
            <!-- Background glow for container -->
            <div class="absolute inset-0">
              <div
                class="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
              ></div>
              <div
                class="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"
              ></div>
            </div>

            <!-- Content -->
            <div
              class="relative z-10 w-full flex flex-col items-center justify-center text-center"
            >
              <!-- Logo or brand element -->
              <div class="mb-8">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group hover:scale-110 transition-transform duration-300 mx-auto"
                >
                  <svg
                    class="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"
                    />
                    <path
                      d="M8.5 12l2 2 5-5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <!-- Main heading -->
              <div class="mb-6">
                <h1
                  class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
                >
                  Logging In
                </h1>
                <p class="text-slate-300 text-lg font-light">
                  Please wait while we authenticate your account...
                </p>
              </div>

              <!-- Enhanced loading animation -->
              <div class="w-48 mx-auto mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  class="w-full h-20"
                >
                  <!-- First circle with gradient -->
                  <defs>
                    <linearGradient
                      id="grad1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #06b6d4; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #8b5cf6; stop-opacity: 1"
                      />
                    </linearGradient>
                    <linearGradient
                      id="grad2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #8b5cf6; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #ec4899; stop-opacity: 1"
                      />
                    </linearGradient>
                    <linearGradient
                      id="grad3"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="stop-color: #ec4899; stop-opacity: 1"
                      />
                      <stop
                        offset="100%"
                        style="stop-color: #f43f5e; stop-opacity: 1"
                      />
                    </linearGradient>
                  </defs>

                  <circle
                    fill="url(#grad1)"
                    r="8"
                    cx="20"
                    cy="32.5"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2"
                      values="32.5;67.5;32.5;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="-.4"
                    ></animate>
                    <animate
                      attributeName="opacity"
                      dur="2"
                      values="0.8;1;0.8;"
                      repeatCount="indefinite"
                      begin="-.4"
                    ></animate>
                  </circle>

                  <circle
                    fill="url(#grad2)"
                    r="8"
                    cx="50"
                    cy="32.5"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2"
                      values="32.5;67.5;32.5;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="-.2"
                    ></animate>
                    <animate
                      attributeName="opacity"
                      dur="2"
                      values="0.8;1;0.8;"
                      repeatCount="indefinite"
                      begin="-.2"
                    ></animate>
                  </circle>

                  <circle
                    fill="url(#grad3)"
                    r="8"
                    cx="80"
                    cy="32.5"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2"
                      values="32.5;67.5;32.5;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="0"
                    ></animate>
                    <animate
                      attributeName="opacity"
                      dur="2"
                      values="0.8;1;0.8;"
                      repeatCount="indefinite"
                      begin="0"
                    ></animate>
                  </circle>
                </svg>
              </div>

              <!-- Status indicator -->
              <div
                class="flex items-center justify-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-cyan-400/30 w-fit mx-auto"
              >
                <div class="p-1 bg-cyan-500/20 rounded-full">
                  <div
                    class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                  ></div>
                </div>
                <span class="text-cyan-300 text-sm font-medium">
                  Securing your connection...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
