import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'

/**
 * Captures the device's current GPS position.
 * On native (iOS/Android), uses Capacitor Geolocation plugin.
 * On web, falls back to the browser's navigator.geolocation API.
 * Returns a formatted string "lat,lng" or null if unavailable/denied.
 */
export async function getCurrentLocation() {
  try {
    if (Capacitor.isNativePlatform()) {
      const permStatus = await Geolocation.checkPermissions()
      if (permStatus.location === 'denied') {
        const requested = await Geolocation.requestPermissions()
        if (requested.location === 'denied') return null
      }
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    })

    const { latitude, longitude } = position.coords
    return `${latitude},${longitude}`
  } catch {
    // Permission denied, timeout, or unavailable — clock-in still works without location
    return null
  }
}
