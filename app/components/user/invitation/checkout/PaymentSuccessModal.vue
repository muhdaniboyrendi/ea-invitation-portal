<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <!-- Success Icon -->
            <div class="flex justify-center mb-6">
              <div
                class="relative w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse"
              >
                <svg
                  class="w-10 h-10 text-white animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <!-- Success Title -->
            <h2
              class="text-2xl font-bold text-center text-slate-900 dark:text-slate-50 mb-2"
            >
              Pembayaran Berhasil!
            </h2>

            <!-- Success Message -->
            <p class="text-center text-slate-600 dark:text-slate-300 mb-6">
              Terima kasih telah melakukan pembayaran. Anda akan dialihkan dalam
              beberapa detik...
            </p>

            <!-- Loading Bar -->
            <div
              class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden"
            >
              <div
                class="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full animate-progress"
              />
            </div>

            <!-- Countdown Timer -->
            <div class="text-center mt-4">
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Mengalihkan dalam beberapa detik...
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
