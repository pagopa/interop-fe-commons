import type { GenerateRoutesOptions, Routes } from './router.types'
import { generateTypedUseNavigate } from './hooks/useNavigate'
import { generateTypedUseParams } from './hooks/useParams'
import { generateRRDRouteObject, generateTypedGetParentRoutes } from './router.utils'
import { generateTypedLink } from './components/Link'
import { generateTypedRedirect } from './components/Redirect'
import { generateBreadcrumbs } from './components/Breadcrumbs'
import { generateTypedUseLocation } from './hooks/useLocation'
import { generateUseAuthGuard } from './hooks/useAuthGuard'
import { generateTypeduseGeneratePath } from './hooks/useGeneratePath'
import { generateUseSwitchPathLang } from './hooks/useSwitchPathLang'

export function generateRoutes<
  Language extends string,
  AuthLevel extends string,
  const TRoutes extends Routes<AuthLevel> = Routes<AuthLevel>
>(routes: TRoutes, options?: GenerateRoutesOptions<Language>) {
  const useNavigate = generateTypedUseNavigate(routes, options)
  const useGeneratePath = generateTypeduseGeneratePath(routes, options)
  const useLocation = generateTypedUseLocation(routes, options)
  const useAuthGuard = generateUseAuthGuard(routes, useLocation)
  const useParams = generateTypedUseParams<TRoutes>()
  const useSwitchPathLang = generateUseSwitchPathLang<Language>(options)

  const Link = generateTypedLink(routes, options)
  const Redirect = generateTypedRedirect(routes, options)

  const getParentRoutes = generateTypedGetParentRoutes(routes)

  const Breadcrumbs = generateBreadcrumbs(routes, getParentRoutes, options)

  const reactRouterDOMRoutes = generateRRDRouteObject(routes, Redirect, options)

  return {
    routes,
    reactRouterDOMRoutes,
    hooks: {
      useNavigate,
      useGeneratePath,
      useLocation,
      useAuthGuard,
      useParams,
      useSwitchPathLang,
    },
    components: {
      Link,
      Redirect,
      Breadcrumbs,
    },
    utils: {
      getParentRoutes,
    },
  }
}
