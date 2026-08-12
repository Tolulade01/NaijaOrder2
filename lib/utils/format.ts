export function formatNaira(value:number){return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(value)}
export function formatDate(value:string|Date){return new Intl.DateTimeFormat('en-NG',{dateStyle:'medium'}).format(new Date(value))}
