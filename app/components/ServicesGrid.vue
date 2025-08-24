<script setup lang="ts">
import { pln } from "../utils/format";
const supabase = useSupabaseClient();

type Service = {
  id: number;
  name: string;
  duration_min: number;
  price: number | null;
  des: string | null;
};

const { data, error } = await useAsyncData<Service[]>("services", async () => {
  const { data, error } = await supabase
    .from("services")
    .select("id,name,duration_min,price,is_active,des") // ← přidán sloupec des
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Service[];
});

// Modal stav
const showDetail = ref(false);
const selected = ref<Service | null>(null);

function openDetails(s: Service) {
  selected.value = s;
  showDetail.value = true;
}
</script>

<template>
  <section class="px-4 py-12">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-2xl font-semibold text-gray-200 mb-6 text-center"
      >
        Nabídka služeb
      </h2>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard
          v-for="s in data || []"
          :key="s.id"
          :ui="{
            root: 'rounded-2xl bg-[#DBBC97] flex flex-col h-full',
            body: 'flex-1',
            footer: '',
          }"
        >
          <!-- BODY -->
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-semibold text-slate-900">{{ s.name }}</h3>
              <p class="mt-2 text-sm text-slate-600">
                Délka: <strong>{{ s.duration_min }} min</strong>
                <span v-if="s.price != null">
                  • Cena:
                  <strong class="badge-accent px-2 py-0.5 rounded">{{
                    pln(s.price)
                  }}</strong>
                </span>
              </p>
            </div>
            <div class="shrink-0 rounded-xl overflow-hidden">
              <img
                :src="`_nuxt/assets/images/massages/${s.id}.jpg`"
                alt=""
                class="w-20 h-20 object-cover"
              />
            </div>
          </div>

          <!-- FOOTER -->
          <template #footer>
            <UButton size="sm" class="btn-primary" @click="openDetails(s)"
              >Detail</UButton
            >
          </template>
        </UCard>
      </div>
    </div>

    <!-- DETAIL MODAL -->
    <UModal v-model:open="showDetail" title="title" description="Popis sluzby">
      <template #content>
        <UCard class="max-w-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ selected?.name }}</h3>
            <div class="flex items-center gap-2">
              <UBadge variant="soft">{{ selected?.duration_min }} min</UBadge>
              <UBadge v-if="selected?.price != null" class="badge-accent">
                {{ pln(selected?.price!) }}
              </UBadge>
            </div>
          </div>

          <div class="prose prose-slate max-w-none whitespace-pre-line">
            {{ selected?.des || "Detail služby zatím není k dispozici." }}
          </div>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" @click="showDetail = false"
                >Zavřít</UButton
              >
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </section>
</template>
