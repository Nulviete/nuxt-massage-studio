<template>
  <section class="relative overflow-hidden bg-[#F8FAFC]">
    <div
      class="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center"
    >
      <div>
        <h1 class="text-4xl md:text-5xl font-serif text-[var(--brand-ink)]">
          Masáže pro tělo i hlavu v pohodlí Vašeho domova.
        </h1>
        <p class="mt-4 text-slate-600">
          Uvolnění zad, šíje a dolních končetin. Rezerwacja online během pár
          vteřin.
        </p>
        <div class="mt-6 flex gap-3">
          <UButton :to="{path: '/', hash: '#rezervace'}" size="lg" class="btn-primary"
            >Rezervovat termín</UButton
          >
          <UButton :to="{path: '/', hash: '#menu'}" size="lg" variant="ghost"
            >Nabídka služeb</UButton
          >
        </div>
      </div>
      <div class="relative">
        <img
          src="/assets/images/hero-massage.jpg"
          alt="Klidné masérské studio"
          class="rounded-2xl shadow-md object-cover w-full h-[340px]"
        />
        <div
          class="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none"
        ></div>
      </div>
    </div>
  </section>
</template>