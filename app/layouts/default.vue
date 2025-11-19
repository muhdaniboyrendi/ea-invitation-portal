<script setup>
// Script ini akan otomatis berlaku untuk SEMUA halaman yang pakai layout ini
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950">
    <Topbar />
    <div
      class="pt-22 lg:pt-24 xl:pt-30 pb-24 lg:pl-65 xl:pl-73 xl:pr-8 min-h-screen overflow-hidden"
    >
      <slot />
    </div>
    <Navbar />
  </div>
</template>
