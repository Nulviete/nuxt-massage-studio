<!-- app/pages/my-events.vue -->
<template>
  <div class="max-w-3xl mx-auto p-4 space-y-4">
    <h1 class="text-2xl font-semibold text-gray-800">Moje rezervace</h1>

    <div class="flex items-center gap-3">
      
      <span v-if="pending">Načítám…</span>
    </div>

    <UAlert
      v-if="error"
      title="Chyba načítání"
      :description="String(error)"
      color="error"
      variant="soft"
    />

    <div v-if="items.length === 0 && !pending && !error" class="text-gray-500">
      Žádné události nenalezeny.
    </div>

    <div class="grid gap-3">
      <UCard v-for="ev in items" :key="ev.id" class="hover:shadow-md transition">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div class="font-medium truncate">
              {{ ev.summary || '(bez názvu)' }}
            </div>
            <div class="flex items-center gap-2">
              <UBadge size="lg">{{ formatDate(ev.start) }}</UBadge>
              <UButton
                size="sm"
                color="error"
                variant="solid"
                :loading="deletingId === ev.id"
                :disabled="deletingId === ev.id"
                @click="onDelete(ev)"
              >
                Zrušit
              </UButton>
            </div>
          </div>
        </template>

        <div class="prose prose-sm max-w-none whitespace-pre-line">
          {{ ev.description }}
        </div>

      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const user = useSupabaseUser()

// jednoduché časové okno – uprav dle potřeby
const now = new Date()
const timeMin = new Date(now.getTime() - 7*24*3600e3).toISOString()
const timeMax = new Date(now.getTime() + 60*24*3600e3).toISOString()

const { data, error, pending, refresh } = await useFetch('/api/my-events', {
  query: { timeMin, timeMax, limit: 250 },
})


const items = computed(() => data.value?.items ?? [])
const deletingId = ref<string | null>(null)

function formatDate(start: string) {
  const d = new Date(start)
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric'}) + '. ' + d.toLocaleTimeString('pl-PL', { hour: 'numeric', minute: 'numeric'})
}

async function onDelete(ev: any) {
  if (!ev?.id) return
  const ok = window.confirm('Opravdu zrušit tuto rezervaci?')
  if (!ok) return

  deletingId.value = ev.id
  try {
    await $fetch(`/api/my-events/${ev.id}`, { method: 'DELETE' })
    toast.add({ title: 'Rezervace zrušena', description: ev.summary || '', color: 'green' })
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'Smazání selhalo', description: String(e?.data?.statusMessage || e?.message || e), color: 'red' })
  } finally {
    deletingId.value = null
  }
}
</script>
