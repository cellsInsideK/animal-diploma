export const getLocaleDate = (date: Date) => {
  return new Date(date).toLocaleString('ru', { dateStyle: 'short', timeStyle: 'short' })
}