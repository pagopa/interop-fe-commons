import { createMemoryHistory } from 'history'
import { generateTestingRoutes, renderHookInRoutes } from './common.mocks'
import { expectTypeOf } from 'vitest'

const {
  reactRouterDOMRoutes,
  hooks: { useSwitchPathLang },
} = generateTestingRoutes()

const languages = ['it', 'en'] as const

const {
  reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes,
  hooks: { useSwitchPathLang: useLocalizedSwitchPathLang },
} = generateTestingRoutes({ languages })

const renderUseSwitchPathLang = () => {
  return renderHookInRoutes(() => useSwitchPathLang(), reactRouterDOMRoutes)
}

const renderLocalizedUseSwitchSwitchPathLang = (initialRoute = '/it/page-1/') => {
  const history = createMemoryHistory({ initialEntries: [initialRoute] })
  return renderHookInRoutes(
    () => useLocalizedSwitchPathLang(),
    reactRouterDOMLocalizedRoutes,
    history
  )
}

describe('useSwitchPathLang', () => {
  it('should throw if called in a router without language options', () => {
    const { result } = renderUseSwitchPathLang()
    const switchPathLang = result.current

    expect(() => switchPathLang('en')).toThrow()
  })

  it('should correctly switch lang path', () => {
    const { result, history } = renderLocalizedUseSwitchSwitchPathLang()
    const switchPathLang = result.current

    switchPathLang('en')
    expect(history.location.pathname).toBe('/en/page-1/')

    switchPathLang('it')
    expect(history.location.pathname).toBe('/it/page-1/')
  })

  it('should correctly switch lang path keeping the hash', () => {
    const { result, history } = renderLocalizedUseSwitchSwitchPathLang('/it/page-1/#test')
    const switchPathLang = result.current

    switchPathLang('en')
    expect(history.location.pathname).toBe('/en/page-1/')
    expect(history.location.hash).toBe('#test')

    switchPathLang('it')
    expect(history.location.pathname).toBe('/it/page-1/')
    expect(history.location.hash).toBe('#test')
  })

  it('should correctly switch lang path keeping the search params', () => {
    const { result, history } = renderLocalizedUseSwitchSwitchPathLang('/it/page-1?test=1')
    const switchPathLang = result.current

    switchPathLang('en')
    expect(history.location.pathname).toBe('/en/page-1')
    expect(history.location.search).toBe('?test=1')

    switchPathLang('it')
    expect(history.location.pathname).toBe('/it/page-1')
    expect(history.location.search).toBe('?test=1')
  })

  it('should have the language param with correct typing', () => {
    type LanguageParam = Parameters<ReturnType<typeof useLocalizedSwitchPathLang>>[0]
    expectTypeOf<LanguageParam>().toMatchTypeOf<(typeof languages)[number]>()
  })

  it('should correctly switch lang if the path include "lang" param and remove it from pathname when switch is done', () => {
    const { result, history } = renderLocalizedUseSwitchSwitchPathLang('/it/page-1?lang=en&test=1')
    const switchPathLang = result.current
    switchPathLang('en')
    expect(history.location.pathname).toBe('/en/page-1')
    expect(history.location.search).toBe('?test=1')
  })
})
