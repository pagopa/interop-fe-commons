import mixpanel, { type Dict, type Config } from 'mixpanel-browser'
import { areCookiesAccepted, initOneTrust, mixpanelInit } from './tracking.utils'
import type { MixPanelEvent, UseTrackPageViewEvent, TrackEvent } from './tracking.types'
import { useEffect, useRef, useSyncExternalStore } from 'react'

export type TrackingConfig = {
  enabled: boolean
  oneTrustScriptUrl: string
  domainScriptUrl: string
  mixpanelToken: string
  mixpanelConfig?: Partial<Config>
  nonce?: string
  getDefaultProps?: () => Dict
  hasOnlyStrictlyNecessaryCookies?: boolean
}

declare global {
  interface Window {
    OptanonWrapper: () => void | undefined
    OneTrust: {
      OnConsentChanged: (callback: () => void) => void
    }
  }
}

const noop = () => void 0

export function initTracking<TMixPanelEvent extends MixPanelEvent>(
  config: TrackingConfig
): {
  /**
   * Tracks an event to Mixpanel
   * It will emit the event if the following conditions are met:
   * - Tracking is enabled;
   * - Mixpanel is initialized.
   *
   * @param eventName the name of the event
   * @param properties the properties of the event
   */
  trackEvent: TrackEvent<TMixPanelEvent>

  /**
   * Emits a page view event to Mixpanel
   * It will emit the event if the following conditions are met:
   * - Tracking is enabled;
   * - Mixpanel is initialized;
   * - The event has not been emitted yet;
   * - All properties values are truthy.
   *
   * @param eventName the name of the event
   * @param properties the properties of the event
   */
  useTrackPageViewEvent: UseTrackPageViewEvent<TMixPanelEvent>

  /**
   * Resets Mixpanel
   */
  resetMixpanel: () => void
} {
  // If tracking is disabled, return noop functions
  if (!config.enabled || typeof window === 'undefined') {
    return {
      trackEvent: noop,
      useTrackPageViewEvent: noop,
      resetMixpanel: noop,
    }
  }

  /**
   * We want to synchronize the initialization of Mixpanel with the React lifecycle.
   * This way, we can call the mixpanel `track_pageview` even if the user navigates
   * to a page and Mixpanel is initialized after the page has loaded, with the help
   * of `useEffect`.
   */

  let didMixpanelInit = false
  const didmixpanelInitListeners: Set<() => void> = new Set()

  // function setMixpanelIdentifier(identifier: string) {
  //   // If Mixpanel is already initialized, identify the user
  //   if (didMixpanelInit) {
  //     mixpanel.identify(identifier)
  //     return
  //   }
  //   // ... otherwise, store the identifier to identify the user when Mixpanel is initialized
  //   mixpanelIdentifier = identifier
  // }

  function resetMixpanel() {
    if (didMixpanelInit) {
      mixpanel.reset()
    }
  }

  function subscribeToMixpanelInit(listener: () => void) {
    didmixpanelInitListeners.add(listener)
    return () => {
      didmixpanelInitListeners.delete(listener)
    }
  }

  function notifyMixpanelInitListeners() {
    didmixpanelInitListeners.forEach((listener) => listener())
  }

  function emitMixpanelInitialized() {
    didMixpanelInit = true
    notifyMixpanelInitListeners()
  }

  function handleMixpanelInit() {
    const doesCookieCheckPass = config.hasOnlyStrictlyNecessaryCookies || areCookiesAccepted()
    if (doesCookieCheckPass && !didMixpanelInit) {
      mixpanelInit(config.mixpanelToken, config?.mixpanelConfig)
      emitMixpanelInitialized()
    }
  }

  window.OptanonWrapper = function () {
    window.OneTrust.OnConsentChanged(handleMixpanelInit)
  }

  initOneTrust(config.oneTrustScriptUrl, config.domainScriptUrl, config.nonce)
  handleMixpanelInit()

  const trackEvent: TrackEvent<TMixPanelEvent> = (eventName, ...properties) => {
    if (!didMixpanelInit) return

    const defaultProperties = config.getDefaultProps?.() ?? {}
    mixpanel.track(eventName, { ...properties[0], ...defaultProperties })
  }

  const useTrackPageViewEvent: UseTrackPageViewEvent<TMixPanelEvent> = (
    eventName,
    ...properties
  ) => {
    const isMixpanelInitialized = useSyncExternalStore(
      subscribeToMixpanelInit,
      () => didMixpanelInit
    )
    const hasAlreadyTracked = useRef(false)

    const eventProperties = properties[0]

    useEffect(() => {
      if (hasAlreadyTracked.current) return
      if (!isMixpanelInitialized) return

      if (!Object.values(eventProperties).every((p) => p !== undefined)) return

      const defaultProperties = config.getDefaultProps?.() ?? {}
      mixpanel.track_pageview(
        { ...eventProperties, ...defaultProperties },
        { event_name: eventName }
      )
      hasAlreadyTracked.current = true
    }, [eventName, isMixpanelInitialized, eventProperties])
  }

  return {
    trackEvent,
    useTrackPageViewEvent,
    resetMixpanel,
  }
}
