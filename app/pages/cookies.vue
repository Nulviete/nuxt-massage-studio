<!-- pages/cookies.vue -->
<script setup lang="ts">
const lastUpdated = '21. 8. 2025'

// Kontakt do patičky/sekce – klidně přepoj na useRuntimeConfig()
const studio = {
  name: 'Mobilní masér Michael',
  email: 'nulvietz@gmail.com'
}

/** Tabulky cookies / úložišť – uprav podle reality projektu */
type Row = { name: string; purpose: string; provider: string; storage: 'Cookie' | 'localStorage' | 'sessionStorage'; duration: string; }
const essentials: Row[] = [
  { name: 'sb-auth (token)', purpose: 'Udržení přihlášení (Supabase)', provider: 'Vlastní (Supabase)', storage: 'localStorage', duration: 'do odhlášení / smazání' },
  { name: 'ui:locale', purpose: 'Jazyk rozhraní', provider: 'Vlastní', storage: 'localStorage', duration: '6 měsíců' },
  { name: 'ui:theme', purpose: 'Světlo / tma', provider: 'Vlastní', storage: 'localStorage', duration: '6 měsíců' },
]

const functional: Row[] = [
  { name: 'ui:consent', purpose: 'Uložení volby souhlasu s cookies', provider: 'Vlastní', storage: 'localStorage', duration: '12 měsíců' },
]

/* Pokud nasadíš analytiku (GA4 apod.), odkomentuj a doplň
const analytics: Row[] = [
  { name: '_ga', purpose: 'Měření návštěvnosti (Google Analytics)', provider: 'Google', storage: 'Cookie', duration: '2 roky' },
  { name: '_gid', purpose: 'Měření návštěvnosti (Google Analytics)', provider: 'Google', storage: 'Cookie', duration: '24 hodin' },
]
*/
const analytics: Row[] = [] // teď žádné analytické cookies nepoužíváme

const marketing: Row[] = [] // nepoužíváme

function clearNonEssential() {
  // Smazání běžných analytických/marketingových cookies (pokud by byly nasazené)
  const kill = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`
  }
  ['_ga', '_gid', '_gat', '_gcl_au', '_fbp', '_fbc'].forEach(kill)

  // Smazání lokálních klíčů pro souhlasy/marketing
  ;['consent:analytics', 'consent:marketing', 'ui:consent'].forEach(key => {
    try { localStorage.removeItem(key) } catch {}
  })

  alert('Ne-nezbytné cookies a související klíče byly odstraněny (pokud existovaly).')
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="text-3xl font-serif text-[var(--brand-ink)]">Cookies</h1>
    <p class="mt-2 text-sm text-white-500">Naposledy aktualizováno: {{ lastUpdated }}</p>

    <UCard class="mt-6 rounded-2xl">
      <p class="text-white-700">
        Na tomto webu používáme pouze nezbytné a funkční cookies/úložiště pro chod aplikace
        (přihlášení, volba jazyka/tematu a ukládání souhlasu). Analytické ani marketingové cookies
        v tuto chvíli <strong>nepoužíváme</strong>.
      </p>
    </UCard>

    <!-- KATEGORIE -->
    <div class="mt-8 space-y-8">
      <div>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">1) Nezbytné</h2>
        <p class="mt-2 text-white-600">
          Potřebné pro základní funkce webu (např. přihlášení přes Supabase). Bez nich by služba nefungovala.
        </p>
        <div class="overflow-x-auto mt-4">
          <table class="min-w-full text-sm">
            <thead class="text-left text-white-500">
              <tr>
                <th class="py-2 pr-4">Název</th>
                <th class="py-2 pr-4">Účel</th>
                <th class="py-2 pr-4">Poskytovatel</th>
                <th class="py-2 pr-4">Úložiště</th>
                <th class="py-2 pr-4">Doba</th>
              </tr>
            </thead>
            <tbody class="align-top">
              <tr v-for="r in essentials" :key="r.name" class="border-t border-white-200/70">
                <td class="py-2 pr-4 font-medium text-white-800">{{ r.name }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.purpose }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.provider }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.storage }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.duration }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">2) Funkční</h2>
        <p class="mt-2 text-white-600">
          Zlepšují komfort používání (pamatují si např. jazyk či volby souhlasů). Bez nich aplikace funguje,
          ale méně pohodlně.
        </p>
        <div class="overflow-x-auto mt-4" v-if="functional.length">
          <table class="min-w-full text-sm">
            <thead class="text-left text-white-500">
              <tr>
                <th class="py-2 pr-4">Název</th>
                <th class="py-2 pr-4">Účel</th>
                <th class="py-2 pr-4">Poskytovatel</th>
                <th class="py-2 pr-4">Úložiště</th>
                <th class="py-2 pr-4">Doba</th>
              </tr>
            </thead>
            <tbody class="align-top">
              <tr v-for="r in functional" :key="r.name" class="border-t border-white-200/70">
                <td class="py-2 pr-4 font-medium text-white-800">{{ r.name }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.purpose }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.provider }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.storage }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.duration }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="mt-2 text-white-600">Aktuálně žádná funkční úložiště nenasazujeme.</p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">3) Analytické</h2>
        <p class="mt-2 text-white-600">
          Pomáhají nám porozumět, jak je web používán. Nasazujeme až po souhlasu.
        </p>
        <div v-if="analytics.length" class="overflow-x-auto mt-4">
          <table class="min-w-full text-sm">
            <thead class="text-left text-white-500">
              <tr>
                <th class="py-2 pr-4">Název</th>
                <th class="py-2 pr-4">Účel</th>
                <th class="py-2 pr-4">Poskytovatel</th>
                <th class="py-2 pr-4">Úložiště</th>
                <th class="py-2 pr-4">Doba</th>
              </tr>
            </thead>
            <tbody class="align-top">
              <tr v-for="r in analytics" :key="r.name" class="border-t border-white-200/70">
                <td class="py-2 pr-4 font-medium text-white-800">{{ r.name }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.purpose }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.provider }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.storage }}</td>
                <td class="py-2 pr-4 text-white-700">{{ r.duration }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="mt-2 text-white-600">Nepoužíváme žádné analytické cookies.</p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">4) Marketingové</h2>
        <p class="mt-2 text-white-600">
          Slouží k zobrazování personalizované reklamy. Nepoužíváme je.
        </p>
        <p class="mt-2 text-white-600" v-if="!marketing.length">Nepoužíváme žádné marketingové cookies.</p>
      </div>
    </div>

    <!-- Ovládání / práva -->
    <UCard class="mt-10 rounded-2xl">
      <h3 class="text-lg font-semibold text-white">Vaše volby</h3>
      <p class="mt-2 text-white-700">
        Nezbytné cookies jsou nutné pro běh webu a nejdou vypnout. Souhlas s analytickými/marketingovými
        cookies (pokud by byly nasazené) můžete kdykoliv odvolat.
      </p>
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <UButton variant="soft" @click="clearNonEssential()">Smazat ne-nezbytné cookies</UButton>
        <NuxtLink to="/gdpr" class="underline text-white-700">Zásady ochrany soukromí</NuxtLink>
      </div>
      <p class="mt-4 text-sm text-white-500">
        Tip: Nastavení cookies můžete spravovat i ve svém prohlížeči (blokování třetích stran, mazání po ukončení atd.).
      </p>
    </UCard>

    <p class="mt-8 text-sm text-white-500">
      Dotazy? Napište nám na <a :href="`mailto:${studio.email}`" class="underline">{{ studio.email }}</a>.
    </p>
  </section>
</template>
