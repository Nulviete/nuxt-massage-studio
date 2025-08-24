<script setup lang="ts">
// Úpravy sem (nebo načti z useRuntimeConfig().public.*, pokud je budeš mít v .env)
const studio = {
  name: 'Michael Zapletal',
  street: 'Warszawska 4/7',
  city: '52-500 Jelenia Gora',
  phone: '+420 775 887 739',
  email: 'nulvietz@gmail.com',
  // volitelné:
  nip: 'PL0000000000',
  mapUrl: 'https://maps.google.com/?q=Ulica%20123%20Warszawa'
}

const year = new Date().getFullYear()

// (volitelně) strukturovaná data pro SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: studio.name,
        telephone: studio.phone,
        email: studio.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: studio.street,
          addressLocality: 'Warszawa',
          postalCode: '00-001',
          addressCountry: 'PL'
        },
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '17:00' }
        ],
        url: typeof window !== 'undefined' ? window.location.origin : undefined
      })
    }
  ]
})
</script>

<template>
  <footer class="mt-16 text-slate-200">
    <!-- Top -->
    <div class="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-3">
      <!-- Kontakt -->
      <div>
        <h3 class="text-sm font-semibold tracking-wide text-slate-300 uppercase">Kontakt</h3>
        <p class="mt-3">
          <span class="font-medium text-white">{{ studio.name }}</span><br>
          {{ studio.street }}<br>
          {{ studio.city }}
        </p>
        <p class="mt-3 space-y-1">
          <a class="block hover:underline" :href="`tel:${studio.phone.replace(/\\s+/g,'')}`">{{ studio.phone }}</a>
          <a class="block hover:underline" :href="`mailto:${studio.email}`">{{ studio.email }}</a>
          <!-- <span v-if="studio.nip" class="block">NIP: {{ studio.nip }}</span> -->
        </p>
        <!-- <p v-if="studio.mapUrl" class="mt-3">
          <a :href="studio.mapUrl" target="_blank" class="inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-white/5 hover:bg-white/10 ring-1 ring-white/10">
            Otevřít mapu
          </a>
        </p> -->
      </div>

      <!-- Provozní doba -->
      <div>
        <h3 class="text-sm font-semibold tracking-wide text-slate-300 uppercase">Provozní doba</h3>
        <ul class="mt-3 space-y-1">
          <li class="flex justify-between gap-4">
            <span>Po–Pá</span><span>9:00–17:00</span>
          </li>
          <li class="flex justify-between gap-4 opacity-70">
            <span>So–Ne</span><span>po domluvě</span>
          </li>
        </ul>
        <p class="mt-4 text-sm text-slate-400">Rezervace online dle dostupnosti v kalendáři.</p>
      </div>

      <!-- Rychlé odkazy -->
      <div>
        <h3 class="text-sm font-semibold tracking-wide text-slate-300 uppercase">Odkazy</h3>
        <ul class="mt-3 grid gap-2">
          <li><NuxtLink :to="{ path: '/', hash: '#rezervace'}" class="hover:underline">Rezervace</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#menu'}" class="hover:underline">Nabídka služeb</NuxtLink></li>
          <li><NuxtLink to="/gdpr" class="hover:underline">Zásady ochrany soukromí</NuxtLink></li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/10">
      <div class="mx-auto max-w-6xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <p class="opacity-80">© {{ year }} {{ studio.name }}. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/gdpr" class="hover:underline">Soukromí</NuxtLink>
          <NuxtLink to="/cookies" class="hover:underline">Cookies</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
