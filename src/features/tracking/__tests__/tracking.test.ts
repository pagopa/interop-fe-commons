import { renderHook } from '@testing-library/react'
import { initTracking, type TrackingConfig } from '..'
import * as trackingUtils from '../tracking.utils'
import mixpanel from 'mixpanel-browser'

vi.mock('mixpanel-browser', () => ({
  default: {
    track: () => {},
    track_pageview: () => {},
  },
}))

const initOneTrustSpy = vi.spyOn(trackingUtils, 'initOneTrust').mockImplementation(() => {})
const mixpanelInitSpy = vi.spyOn(trackingUtils, 'mixpanelInit').mockImplementation(() => {})
const mixpanelTrackSpy = vi.spyOn(mixpanel, 'track').mockImplementation(() => {})
const mixpanelTrackPageViewSpy = vi.spyOn(mixpanel, 'track_pageview').mockImplementation(() => {})

afterEach(() => {
  vi.clearAllMocks()
})

type TrackingEvent = {
  eventName: 'testEvent'
  properties: { test: 'test' }
}

const config: TrackingConfig = {
  enabled: true,
  oneTrustScriptUrl: 'https://example.com/oneTrust.js',
  domainScriptUrl: 'https://example.com/domain.js',
  mixpanelToken: '123456',
}

describe('initTracking', () => {
  it('should call initOneTrust', () => {
    initTracking(config)
    expect(initOneTrustSpy).toHaveBeenCalledWith(
      config.oneTrustScriptUrl,
      config.domainScriptUrl,
      undefined
    )
  })

  it('should call mixpanelInit if cookies are accepted', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)
    initTracking(config)
    expect(mixpanelInitSpy).toHaveBeenCalledWith(config.mixpanelToken, config.mixpanelConfig)
  })

  it('should not call mixpanelInit if cookies are not accepted', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(false)
    initTracking(config)
    expect(mixpanelInitSpy).not.toHaveBeenCalled()
  })

  it('should call mixpanelInit if cookies are accepted after consent', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(false)
    initTracking(config)
    expect(mixpanelInitSpy).not.toHaveBeenCalled()

    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)
    window.dispatchEvent(new Event('consent.onetrust'))
    expect(mixpanelInitSpy).toHaveBeenCalledWith(config.mixpanelToken, config.mixpanelConfig)
  })

  it('should call mixpanelInit only once', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)
    initTracking(config)
    expect(mixpanelInitSpy).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new Event('consent.onetrust'))
    expect(mixpanelInitSpy).toHaveBeenCalledTimes(1)
  })

  it('should not call mixpanelInit if tracking is disabled', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)
    initTracking({ ...config, enabled: false })
    expect(mixpanelInitSpy).not.toHaveBeenCalled()
  })

  it('should not call mixpanelInit if tracking is disabled after consent', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(false)
    initTracking({ ...config, enabled: false })
    expect(mixpanelInitSpy).not.toHaveBeenCalled()

    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)
    window.dispatchEvent(new Event('consent.onetrust'))
    expect(mixpanelInitSpy).not.toHaveBeenCalled()
  })

  it('should call initOneTrust with nonce', () => {
    const nonce = '123'
    initTracking({ ...config, nonce })
    expect(initOneTrustSpy).toHaveBeenCalledWith(
      config.oneTrustScriptUrl,
      config.domainScriptUrl,
      nonce
    )
  })

  it('should correctly call trackEvent', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)

    const { trackEvent } = initTracking<TrackingEvent>(config)

    trackEvent('testEvent', { test: 'test' })
    expect(mixpanelTrackSpy).toHaveBeenCalledWith('testEvent', { test: 'test' })
  })

  it('should not call trackEvent if tracking is disabled', () => {
    const { trackEvent } = initTracking<TrackingEvent>({ ...config, enabled: false })

    trackEvent('testEvent', { test: 'test' })
    expect(mixpanelTrackSpy).not.toHaveBeenCalled()
  })

  it('should not call trackEvent if cookies are not accepted', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(false)

    const { trackEvent } = initTracking<TrackingEvent>(config)

    trackEvent('testEvent', { test: 'test' })
    expect(mixpanelTrackSpy).not.toHaveBeenCalled()
  })

  it('should call mixpanel.track_pageview function on page view', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)
    const { useTrackPageViewEvent } = initTracking<TrackingEvent>(config)

    renderHook(() => useTrackPageViewEvent('testEvent', { test: 'test' }))

    expect(mixpanelTrackPageViewSpy).toHaveBeenCalledWith(
      { test: 'test' },
      { event_name: 'testEvent' }
    )
  })

  it('should not call mixpanel.track_pageview function on page view if tracking is disabled', () => {
    const { useTrackPageViewEvent } = initTracking<TrackingEvent>({ ...config, enabled: false })

    renderHook(() => useTrackPageViewEvent('testEvent', { test: 'test' }))

    expect(mixpanelTrackPageViewSpy).not.toHaveBeenCalled()
  })

  it('should not call mixpanel.track_pageview function on page view if cookies are not accepted', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(false)
    const { useTrackPageViewEvent } = initTracking<TrackingEvent>(config)

    renderHook(() => useTrackPageViewEvent('testEvent', { test: 'test' }))

    expect(mixpanelTrackPageViewSpy).not.toHaveBeenCalled()
  })

  it('should call mixpanel.track_pageview function on page view if cookies are accepted after consent', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(false)
    const { useTrackPageViewEvent } = initTracking<TrackingEvent>(config)

    const { rerender } = renderHook(() => useTrackPageViewEvent('testEvent', { test: 'test' }))

    expect(mixpanelTrackPageViewSpy).not.toHaveBeenCalled()

    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)
    window.dispatchEvent(new Event('consent.onetrust'))

    rerender()

    expect(mixpanelTrackPageViewSpy).toHaveBeenCalled()
  })

  it('should call mixpanel.track_pageview function on page view only once', () => {
    vi.spyOn(trackingUtils, 'areCookiesAccepted').mockReturnValue(true)
    const { useTrackPageViewEvent } = initTracking<TrackingEvent>(config)

    const { rerender } = renderHook(() => useTrackPageViewEvent('testEvent', { test: 'test' }))

    expect(mixpanelTrackPageViewSpy).toHaveBeenCalledTimes(1)
    window.dispatchEvent(new Event('consent.onetrust'))

    rerender()
    expect(mixpanelTrackPageViewSpy).toHaveBeenCalledTimes(1)
  })
})
