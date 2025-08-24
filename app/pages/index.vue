<template>
  <div>
    <HeroSection />
    <ServicesGrid id="menu" class="bg-green-800" />
    <!-- Tady můžeš vložit svůj BookingCalendar -->
    <section class="mx-auto px-4 py-12 bg-[#C89061] text-black">
      <h2 id="rezervace" class="text-2xl font-semibold text-gray-900 mb-4 text-center">
        Rezervace
      </h2>
      <bookingCalendar v-if="user" :user="user" />
      <div v-else class="text-center py-6" id="rezervace">Pro zobrazení registračního kalendáře se musíte nejprve <NuxtLink to="/login" class="underline duration-200 hover:text-blue-500">přihlásit</NuxtLink> </div>
    
    </section>
    <AboutSection id="about" class="bg-gray-200" />
  </div>
</template>

<script setup>
const user = useSupabaseUser();
</script>

<style lang="scss" scoped>
</style>