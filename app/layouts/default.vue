<template>
  <div class="bg-slate-50 dark:bg-slate-950">
    <Topbar />
    <div class="pt-22 lg:pt-24 px-4 lg:px-6 pb-24 lg:pl-70 min-h-screen">
      <slot />
    </div>
    <Navbar />
  </div>
</template>
