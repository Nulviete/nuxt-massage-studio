<template>
  <UApp :locale="locale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { pl } from '@nuxt/ui/locale'
const locale = pl
useHead({ 
  htmlAttrs: 
    { 
      lang: locale.code, 
      dir: locale.dir, 
      class: 'scroll-smooth'
    } 
  })

</script>

<style scoped>

</style>
