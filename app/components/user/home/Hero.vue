<template>
  <div class="relative">
    <!-- Main container with modern glassmorphism -->
    <div
      class="relative backdrop-blur-2xl bg-white/80 dark:bg-dark/80 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
    >
      <!-- Animated gradient background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/10 dark:to-purple-500/20"
      ></div>

      <!-- Content -->
      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <!-- Enhanced icon container -->
        <div class="mb-8">
          <div
            class="inline-flex items-center px-4 py-2 mb-8 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 rounded-full shadow-lg"
          >
            <span
              class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"
            ></span>
            <span class="text-sm font-medium text-dark/90 dark:text-white/90"
              >Digital Wedding Invitation</span
            >
          </div>

          <!-- Enhanced typography -->
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-dark dark:text-white"
          >
            Selamat Datang di
            <br />
            <span
              class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent bg-size-200 animate-gradient-x text-4xl md:text-5xl lg:text-6xl font-extrabold"
            >
              EA Invitation
            </span>
          </h2>

          <p
            class="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Ciptakan undangan digital yang memukau dengan template premium dan
            fitur-fitur canggih yang akan membuat momen spesial Anda semakin
            berkesan
          </p>
        </div>

        <!-- Enhanced CTA button -->
        <div>
          <NuxtLink
            to="/"
            class="group relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg md:text-xl font-bold rounded-2xl shadow-2xl shadow-blue-500/25 dark:shadow-blue-400/20 hover:shadow-blue-500/40 dark:hover:shadow-blue-400/30 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
          >
            <!-- Background glow -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
            ></div>

            <!-- Button content -->
            <div class="relative flex items-center gap-4">
              <div
                class="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              >
                <i class="bi bi-plus-circle text-xl text-white"></i>
              </div>
              <span class="drop-shadow-sm">Buat Undangan Sekarang</span>
              <div
                class="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
              >
                <i class="bi bi-arrow-right text-sm text-white"></i>
              </div>
            </div>

            <!-- Animated background shine -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"
            ></div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
