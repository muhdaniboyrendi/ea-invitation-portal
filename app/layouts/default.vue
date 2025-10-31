<template>
  <div class="bg-slate-50 dark:bg-slate-950">
    <Topbar />
    <div class="pt-22 lg:pt-24 pb-24 lg:pl-65 min-h-screen overflow-hidden">
      <slot />
    </div>
    <Navbar />
  </div>
</template>
