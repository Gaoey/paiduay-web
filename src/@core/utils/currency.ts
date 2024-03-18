export function toCurrency(numb: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB'
  })
    .format(numb)
    .split('.')[0]
}
