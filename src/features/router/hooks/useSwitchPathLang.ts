import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { RoutesBuilderConfig } from '../router.types'

export function generateUseSwitchPathLang<T extends string>(config?: RoutesBuilderConfig) {
  const configLanguages = config?.languages

  return function useSwitchPathLang() {
    const location = useLocation()
    const navigate = useNavigate()

    const switchPathLang = React.useCallback(
      (toLang: T) => {
        const path = location.pathname
        const segments = path.split('/')
        const firstBit = segments[1]
        const urlParams = new URLSearchParams(location.search)

        if (!configLanguages) {
          throw new Error('useSwitchPathLang requires languages to be defined')
        }

        if (!configLanguages.includes(firstBit)) {
          console.warn(
            `useSwitchPathLang: path "${path}" does not start with a language accepted from our initial configuration.`
          )
          return
        }

        urlParams.delete('lang')

        const newPathname = path.replace(`/${firstBit}/`, `/${toLang}/`)

        const newSearch = urlParams.toString()
        const searchPrefix = newSearch ? `?${newSearch}` : ''
        navigate(
          {
            pathname: newPathname,
            search: searchPrefix,
            hash: location.hash,
          },
          { replace: true }
        )
      },
      [location, navigate]
    )

    return switchPathLang
  }
}
