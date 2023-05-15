import React from 'react'
import type { Routes } from '../router.types'
import { Breadcrumbs as MUIBreadcrumbs, Link as MUILink } from '@mui/material'
import { generateTypedGetParentRoutes, getRouteKeyFromPath, splitPath } from '../routes.utils'
import { useLocation, useParams, Link as RRDLink } from 'react-router-dom'

export function generateBreadcrumbs<
  TRoutes extends Routes,
  RouteKey extends keyof TRoutes = keyof TRoutes
>(routes: TRoutes) {
  type BreadcrumbProps = {
    routeLabels: Record<RouteKey, string>
  }

  const getParentRoutes = generateTypedGetParentRoutes(routes)

  return function Breadcrumbs({ routeLabels }: BreadcrumbProps) {
    const params = useParams()
    const location = useLocation()

    const currentRouteKey = React.useMemo(() => {
      return getRouteKeyFromPath(location.pathname, routes)
    }, [location.pathname])

    const toDynamicPath = (routeKey: RouteKey) => {
      const subpaths = splitPath(routes[routeKey].path)

      const dynamicSplit = subpaths.map((pathFragment) => {
        const isDynamicFragment = pathFragment.charAt(0) === ':'
        if (isDynamicFragment) {
          const dynamicKey = pathFragment.substring(1)
          return params[dynamicKey]
        }
        return pathFragment
      })

      return `/${dynamicSplit.join('/')}`
    }

    const parentRoutes = getParentRoutes(currentRouteKey)
    const links = ([...parentRoutes, currentRouteKey] as Array<RouteKey>).map((r: RouteKey) => ({
      label: routeLabels[r],
      // Remap dynamic parts of the path to their current value
      path: toDynamicPath(r),
    }))

    // Don't display breadcrumbs for first level descentants, they are useless
    if (links.length < 2) {
      return null
    }

    return (
      <MUIBreadcrumbs sx={{ mb: 1 }}>
        {links.map(({ label, path }, i) => {
          if (i === links.length - 1) {
            return <span key={i}>{label}</span>
          }
          return (
            <MUILink component={RRDLink} key={i} to={path} sx={{ fontWeight: 700 }} color="inherit">
              {label}
            </MUILink>
          )
        })}
      </MUIBreadcrumbs>
    )
  }
}
