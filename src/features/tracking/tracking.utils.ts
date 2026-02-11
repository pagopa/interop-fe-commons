import mixpanel, { type Config } from 'mixpanel-browser'

const TARG_COOKIES_GROUP = 'C0002'
declare const OnetrustActiveGroups: string

export function initOneTrust(oneTrustScriptUrl: string, domainScriptUrl: string, nonce?: string) {
  const scriptEl = document.createElement('script')
  scriptEl.setAttribute('src', oneTrustScriptUrl)
  scriptEl.setAttribute('type', 'text/javascript')
  scriptEl.setAttribute('charset', 'UTF-8')
  scriptEl.setAttribute('data-domain-script', domainScriptUrl)
  if (nonce) {
    scriptEl.setAttribute('nonce', nonce)
  }
  document.head.appendChild(scriptEl)
}

export function mixpanelInit(mixpanelToken: string, mixpanelConfig?: Partial<Config>): void {
  mixpanel.init(mixpanelToken, {
    api_host: 'https://api-eu.mixpanel.com',
    persistence: 'localStorage',
    // if this is true, Mixpanel will automatically determine
    // City, Region and Country data using the IP address of
    // the client
    ip: false,
    // names of properties/superproperties which should never
    // be sent with track() calls
    property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
    debug: true,
    // function called after mixpanel has finished loading

    // prop to track every page view
    // track_pageview: 'full-url',
    ...mixpanelConfig,
  })

  mixpanel.identify(mixpanel.get_distinct_id())
}

export function areCookiesAccepted(): boolean {
  return (
    typeof OnetrustActiveGroups !== 'undefined' &&
    Boolean(OnetrustActiveGroups) &&
    OnetrustActiveGroups.includes(TARG_COOKIES_GROUP)
  )
}
