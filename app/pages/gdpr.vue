<!-- pages/gdpr.vue -->
<script setup lang="ts">
const lastUpdated = '21. 8. 2025'

// DOPLŇ SI SVÉ ÚDAJE:
const studio = {
  name: 'Mobilní masér Michael',
  street: 'Warszawska 4/7',
  city: '52-500 Jelenia Gora',
  email: 'nulvietz@gmail.com',
  phone: '+420 775 887 739',
  // optional:
  dpo: '', // Pověřenec pro ochranu osobních údajů (pokud máte)
  website: 'https://example.com'
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="text-3xl font-serif text-white">Zásady ochrany osobních údajů (GDPR)</h1>
    <p class="mt-2 text-sm text-white">Naposledy aktualizováno: {{ lastUpdated }}</p>

    <UCard class="mt-6 rounded-2xl">
      <p class="text-white-700">
        Tato stránka vysvětluje, jak zpracováváme osobní údaje při rezervaci masáží
        a používání našeho webu. Dbáme na zákonnost, transparentnost a minimalizaci
        údajů dle GDPR.
      </p>
    </UCard>

    <div class="mt-8 space-y-8">
      <!-- Správce -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">1) Kdo je správcem</h2>
        <p class="mt-2 text-white-700">
          Správcem je <strong>{{ studio.name }}</strong>, {{ studio.street }}, {{ studio.city }}.
          Kontakt: <a :href="`mailto:${studio.email}`" class="underline">{{ studio.email }}</a>,
          tel. {{ studio.phone }}.
          <span v-if="studio.dpo">Pověřenec pro ochranu osobních údajů: {{ studio.dpo }}.</span>
        </p>
      </section>

      <!-- Jaké údaje -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">2) Jaké údaje zpracováváme</h2>
        <ul class="mt-2 list-disc pl-6 text-white-700 space-y-1">
          <li><strong>Účet uživatele:</strong> jméno, e-mail, telefon, adresa (zadávané při registraci/úpravě profilu).</li>
          <li><strong>Rezervace:</strong> vybrané služby, datum a čas, poznámka, identifikátor uživatele; synchronizace do Google Kalendáře.</li>
          <li><strong>Technické údaje:</strong> IP adresa, user-agent, logy chyb (pro bezpečnost a diagnostiku).</li>
          <li><strong>Cookies a lokální úložiště:</strong> viz <NuxtLink to="/cookies" class="underline">stránka Cookies</NuxtLink>.</li>
          <li v-if="false"><strong>Analytika:</strong> po souhlasu GA4 (page_view, základní metriky; bez marketingu).</li>
        </ul>
      </section>

      <!-- Účely a právní základy -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">3) Účely a právní základy</h2>
        <ul class="mt-2 list-disc pl-6 text-white-700 space-y-1">
          <li><strong>Realizace rezervace a poskytování služby</strong> – plnění smlouvy (čl. 6(1)(b) GDPR).</li>
          <li><strong>Uživatelský účet a komunikace</strong> – plnění smlouvy a náš oprávněný zájem na podpoře (čl. 6(1)(b),(f)).</li>
          <li><strong>Bezpečnost a prevence zneužití</strong> – náš oprávněný zájem (čl. 6(1)(f)).</li>
          <li><strong>Analytika (GA4)</strong> – pouze po vašem souhlasu (čl. 6(1)(a)); bez souhlasu neaktivní.</li>
          <li><strong>Účetní/daňové povinnosti</strong> (pokud bude relevantní) – zákonná povinnost (čl. 6(1)(c)).</li>
        </ul>
      </section>

      <!-- Doby uložení -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">4) Doba uložení</h2>
        <ul class="mt-2 list-disc pl-6 text-white-700 space-y-1">
          <li><strong>Účet uživatele:</strong> po dobu trvání účtu a do 3 let od poslední aktivity nebo do jeho smazání.</li>
          <li><strong>Data o rezervacích:</strong> 3 roky (pro řešení dotazů/reklamací), není-li zákonem vyžadováno déle.</li>
          <li><strong>Technické logy:</strong> obvykle do 6 měsíců.</li>
          <li><strong>Souhlasy s cookies/analytikou:</strong> do 24 měsíců (nebo dle právních požadavků).</li>
          <li><strong>GA4:</strong> retence v Google Analytics (typicky 14 měsíců) – pouze pokud dáte souhlas.</li>
        </ul>
      </section>

      <!-- Příjemci / zpracovatelé -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">5) Příjemci a zpracovatelé</h2>
        <p class="mt-2 text-white-700">Osobní údaje sdílíme jen v nezbytném rozsahu s těmito partnery:</p>
        <ul class="mt-2 list-disc pl-6 text-white-700 space-y-1">
          <li><strong>Supabase</strong> (autentizace, databáze) – region EU (pokud je zvolen ve vašem projektu).</li>
          <li><strong>Google</strong> (Google Calendar API; GCP) – plánování termínů; může docházet k přenosům mimo EHP.</li>
          <li><strong>Google Analytics 4</strong> – pouze po souhlasu; přes Consent Mode a minimální sběr.</li>
          <li><strong>E-mail/SMS poskytovatel</strong> (pokud používáme pro notifikace) – jen kontaktní údaje nutné k doručení zprávy.</li>
          <li><strong>Hosting a IT podpora</strong> – provoz webu a bezpečnost (např. Vercel/Netlify/server).</li>
        </ul>
      </section>

      <!-- Přenosy mimo EHP -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">6) Přenosy do třetích zemí</h2>
        <p class="mt-2 text-white-700">
          Některé služby (zejména Google) mohou přenášet data mimo EHP (např. do USA). Používáme
          standardní smluvní doložky (SCC) a dodatečná opatření. Analytika je aktivní jen s vaším souhlasem.
        </p>
      </section>

      <!-- Vaše práva -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">7) Vaše práva</h2>
        <ul class="mt-2 list-disc pl-6 text-white-700 space-y-1">
          <li>právo na přístup k údajům,</li>
          <li>opravu či doplnění,</li>
          <li>výmaz („být zapomenut“),</li>
          <li>omezení zpracování,</li>
          <li>přenositelnost údajů,</li>
          <li>vznést námitku proti zpracování založenému na oprávněném zájmu,</li>
          <li>odvolat souhlas (pokud je základem souhlas), aniž to ovlivní dřívější zákonné zpracování.</li>
        </ul>
        <p class="mt-2 text-white-700">
          Své žádosti posílejte na <a :href="`mailto:${studio.email}`" class="underline">{{ studio.email }}</a>.
          Odpovíme bez zbytečného odkladu, nejpozději do 30 dní.
        </p>
      </section>

      <!-- Dozorový úřad -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">8) Dozorový úřad</h2>
        <p class="mt-2 text-white-700">
          Pokud nejste spokojeni s vyřízením, můžete podat stížnost u dozorového úřadu:
          <br>
          <strong>Urząd Ochrony Danych Osobowych (UODO)</strong>,
          ul. Stawki 2, 00-193 Warszawa,
          <a href="https://uodo.gov.pl" target="_blank" class="underline">uodo.gov.pl</a>.
        </p>
      </section>

      <!-- Změny -->
      <section>
        <h2 class="text-xl font-semibold text-[var(--brand-ink)]">9) Změny těchto zásad</h2>
        <p class="mt-2 text-white-700">
          Zásady můžeme upravovat, například při změně technologií či právních požadavků.
          Vždy uvedeme datum poslední aktualizace.
        </p>
      </section>
    </div>

    <!-- Kontaktní box -->
    <UCard class="mt-10 rounded-2xl">
      <h3 class="text-lg font-semibold text-white">Kontakt pro GDPR</h3>
      <p class="mt-2 text-white-700">
        {{ studio.name }}, {{ studio.street }}, {{ studio.city }}<br>
        E-mail: <a :href="`mailto:${studio.email}`" class="underline">{{ studio.email }}</a>,
        Tel.: {{ studio.phone }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <NuxtLink to="/cookies" class="underline">Informace o cookies</NuxtLink>
      </div>
    </UCard>
  </section>
</template>
