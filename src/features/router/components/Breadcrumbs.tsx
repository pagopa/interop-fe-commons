import React from 'react'
import type { Routes, RoutesBuilderConfig } from '../router.types'
import { MIBreadcrumbs } from '@pagopa/mui-italia'
import {
  getRouteKeyFromPath,
  prefixPathnameWithLang,
  removeLanguageSubpathFromPathname,
  splitPath,
} from '../router.utils'
import { Link as RRDLink, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Link as MUILink } from '@mui/material'

export function generateBreadcrumbs<
  TRoutes extends Routes,
  RouteKey extends keyof TRoutes = keyof TRoutes,
>(routes: TRoutes, getParentRoutes: (input: RouteKey) => RouteKey[], config?: RoutesBuilderConfig) {
  type BreadcrumbProps = {
    routeLabels: { [R in RouteKey]: string | false }
    /**
     * Key in location.state containing query parameters (e.g. { page: '2' })
     * to restore on the immediately preceding visible breadcrumb link.
     */
    parentQueryParamsStateKey?: string
  }
  const languages = config?.languages ?? []
  const hasLanguages = !!config?.languages && config.languages.length > 0

  return function Breadcrumbs({ routeLabels, parentQueryParamsStateKey }: BreadcrumbProps) {
    const params = useParams()
    const location = useLocation()
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
          if (i === breadcrumbSegments.length - 1) {
            return <span key={i}>{label}</span>
          }

          const isRightBehindCurrent = i === breadcrumbSegments.length - 2

          const pathWithMaybeQuery =
            isRightBehindCurrent && parentQueryParamsStateKey
              ? `${path}?${new URLSearchParams(
                  location.state?.[parentQueryParamsStateKey]
                ).toString()}`
              : path

          return (
            <MUILink
              component={RRDLink}
              key={i}
              to={pathWithMaybeQuery}
              sx={{ fontWeight: 700 }}
              color="inherit"
            >
              {label}
            </MUILink>
          )
        })}
      </MIBreadcrumbs>
    )
  }
}
