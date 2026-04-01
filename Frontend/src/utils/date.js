import { ref, onMounted, onUnmounted } from 'vue'
import { format } from 'date-fns'

/**
 * Reactive composable that returns today's date, updating at midnight.
 */
export function useToday() {
  const today = ref(new Date())
  let timer = null

  function scheduleNextMidnight() {
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const ms = tomorrow - now + 100 // +100ms buffer
    timer = setTimeout(() => {
      today.value = new Date()
      scheduleNextMidnight()
    }, ms)
  }

  onMounted(() => scheduleNextMidnight())
  onUnmounted(() => clearTimeout(timer))

  return today
}

/**
 * Format a date using date-fns.
 */
export function formatDate(date, pattern = 'yyyy-MM-dd') {
  return format(date, pattern)
}

/**
 * Format a currency value for display.
 */
export function formatCurrency(amount, currency = 'SEK') {
  const num = Number(amount)
  if (isNaN(num)) return `– ${currency}`

  const localeMap = {
    SEK: 'sv-SE',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    CAD: 'en-CA',
    AUD: 'en-AU'
  }

  return new Intl.NumberFormat(localeMap[currency] || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num)
}
