import React from 'react'
import type { Routes, RoutesBuilderConfig } from '../router.types'
import { MIBreadcrumbItem, MIBreadcrumbs } from '@pagopa/mui-italia'
import {
  getRouteKeyFromPath,
  prefixPathnameWithLang,
  removeLanguageSubpathFromPathname,
  splitPath,
} from '../router.utils'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function generateBreadcrumbs<
  TRoutes extends Routes,
  RouteKey extends keyof TRoutes = keyof TRoutes,
>(routes: TRoutes, getParentRoutes: (input: RouteKey) => RouteKey[], config?: RoutesBuilderConfig) {
  type BreadcrumbProps = {
    routeLabels: { [R in RouteKey]: string | false }
  }
  const languages = config?.languages ?? []
  const hasLanguages = !!config?.languages && config.languages.length > 0

  return function Breadcrumbs({ routeLabels }: BreadcrumbProps) {
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { i18n } = useTranslation()
    const currentLang = hasLanguages ? i18n.language : undefined

    const currentRouteKey = React.useMemo(() => {
      return getRouteKeyFromPath(
        removeLanguageSubpathFromPathname(location.pathname, languages),
        routes
      ) as RouteKey
    }, [location.pathname])

    const getPathFromRouteKey = (routeKey: RouteKey) => {
      const subpaths = splitPath(routes[routeKey].path)

      const dynamicSplit = subpaths.map((pathFragment) => {
        const isDynamicFragment = pathFragment.charAt(0) === ':'
        if (isDynamicFragment) {
          const dynamicKey = pathFragment.substring(1)
          return params[dynamicKey]
        }
        return pathFragment
      })

      return prefixPathnameWithLang(`/${dynamicSplit.join('/')}`, currentLang)
    }

    const parentRoutes = getParentRoutes(currentRouteKey)
    const breadcrumbSegments = ([...parentRoutes, currentRouteKey] as Array<RouteKey>)
      .filter((r) => routeLabels[r] !== false)
      .map((routeKey) => ({
        label: routeLabels[routeKey],
        path: getPathFromRouteKey(routeKey),
      }))

    // Don't display breadcrumbs for first level descentants, they are useless
    if (breadcrumbSegments.length < 2) {
      return null
    }

    return (
      <MIBreadcrumbs sx={{ mb: 1 }}>
        {breadcrumbSegments.map(({ label, path }, i) => {
          // Don't click on first or last breadcrumb items, it's useless
          const isClickable = i !== 0 && i !== breadcrumbSegments.length - 1

          return (
            <MIBreadcrumbItem
              key={i}
              label={String(label)}
              {...(isClickable ? { onClick: () => navigate(path) } : { current: true })}
            />
          )
        })}
      </MIBreadcrumbs>
    )
  }
}
