export default defineAppConfig({
  ui: {
    // nastavíme vlastní primární barvu přes alias "brand"
    primary: 'brand',
    gray: 'slate',          // neutrální škála (může být 'zinc' | 'neutral' | 'slate' ...)
    strategy: 'class',      // Tailwind třídy (doporučeno)

    // definice vlastních barev (hex, rgb nebo css var)
    colors: {
      brand: '#1ebbb6ff',     // tvoje hlavní barva
      // můžeš přidat další aliasy, když je budeš někde používat:
      // accent: '#E2B887'
    },

    // volitelné tokeny
    // rounded: 'xl',       // víc zaoblené komponenty
    // icons: { dynamic: true },
  }
})