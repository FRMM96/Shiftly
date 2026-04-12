import { Preferences } from '@capacitor/preferences'

const KEYS = {
  SCHEDULE: 'cache_schedule',
  USER: 'cache_user'
}

/**
 * Save the worker's upcoming schedule for offline access.
 */
export async function cacheSchedule(schedule) {
  await Preferences.set({ key: KEYS.SCHEDULE, value: JSON.stringify(schedule) })
}

/**
 * Retrieve the cached schedule (returns [] if nothing cached).
 */
export async function getCachedSchedule() {
  const { value } = await Preferences.get({ key: KEYS.SCHEDULE })
  return value ? JSON.parse(value) : []
}

/**
 * Save the current user context for offline access.
 */
export async function cacheUser(user) {
  await Preferences.set({ key: KEYS.USER, value: JSON.stringify(user) })
}

/**
 * Retrieve the cached user context (returns null if nothing cached).
 */
export async function getCachedUser() {
  const { value } = await Preferences.get({ key: KEYS.USER })
  return value ? JSON.parse(value) : null
}

/**
 * Clear all cached data (call on logout).
 */
export async function clearCache() {
  await Preferences.remove({ key: KEYS.SCHEDULE })
  await Preferences.remove({ key: KEYS.USER })
}
