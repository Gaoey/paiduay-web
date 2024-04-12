export function toCurrency(numb: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  })
    .format(numb)
    .split('.')[0]
}
