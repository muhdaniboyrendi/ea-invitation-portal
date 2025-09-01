<script setup>
const colorMode = useColorMode();

const themeOptions = [
  {
    value: "light",
    icon: "bi bi-sun",
  },
  {
    value: "dark",
    icon: "bi bi-moon",
  },
  {
    value: "system",
    icon: "bi bi-display",
  },
];

const setTheme = (theme) => {
  colorMode.preference = theme;
};
</script>

<template>
  <div class="mt-8">
    <div
      class="group w-fit mx-auto relative bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 rounded-2xl"
    >
      <div
        class="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-xl rounded-2xl group-hover:blur-2xl transition-all duration-500"
      ></div>

      <div
        class="relative bg-dark/10 dark:bg-dark/80 border border-white/20 rounded-2xl shadow-xl p-4 overflow-hidden"
      >
        <div class="text-center mb-3">
          <h3 class="text-white/60 text-sm">Preferensi Tema</h3>
        </div>

        <ClientOnly>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              @click="setTheme(option.value)"
              :class="[
                'group relative rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50',
                colorMode.preference === option.value
                  ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-lg shadow-cyan-400/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30',
              ]"
            >
              <div class="flex justify-center">
                <div
                  :class="[
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                    colorMode.preference === option.value
                      ? 'bg-gradient-to-br from-cyan-400/30 to-purple-500/30 shadow-lg'
                      : 'bg-white/10 group-hover:bg-white/20',
                  ]"
                >
                  <i
                    :class="[
                      option.icon,
                      'text-lg transition-colors duration-300',
                      colorMode.preference === option.value
                        ? 'text-cyan-300'
                        : 'text-white/70 group-hover:text-white/90',
                    ]"
                  ></i>
                </div>
              </div>

              <div
                class="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </button>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
