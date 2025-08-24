// utils/format.ts
export const fmtTime = new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit', hour12: false })
export const fmtDate = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric' })
export const fmtDateTime = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
export const fmtPLN = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })


export const timePL = (d: Date) => fmtTime.format(d)
export const datePL = (d: Date) => fmtDate.format(d)
export const dateTimePL = (d: Date) => fmtDateTime.format(d)
export const pln = (amount?: number | null) => (amount ?? null) === null ? '' : fmtPLN.format(Number(amount))