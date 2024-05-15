import React from 'react'
import {
  generatePath as rrdGeneratePath,
  Link as RRDLink,
  type NavigateOptions,
} from 'react-router-dom'
import {
  Button,
  type ButtonProps as MUIButtonProps,
  Link as MUILink,
  type LinkProps as MUILinkProps,
} from '@mui/material'
import type { ExtractRouteParams, Routes, RoutesBuilderConfig } from '../router.types'
import { omit, prefixPathnameWithLang } from '../router.utils'
import { useTranslation } from 'react-i18next'

export interface LinkOptions extends NavigateOptions {
  urlParams: Record<string, string>
}

export function generateTypedLink<TRoutes extends Routes>(
  routes: TRoutes,
  config?: RoutesBuilderConfig
) {
  const hasLanguages = !!config?.languages && config.languages.length > 0

  function Link<RouteKey extends keyof TRoutes = keyof TRoutes>(
    props: {
      to: RouteKey
      options?: LinkOptions
    } & (ExtractRouteParams<TRoutes[RouteKey]['path']> extends undefined
      ? object
      : { params: ExtractRouteParams<TRoutes[RouteKey]['path']> }) &
      (
        | ({ as?: 'link' } & Omit<MUILinkProps<typeof RRDLink>, 'component' | 'to' | 'href'>)
        | ({ as: 'button' } & Omit<
            MUIButtonProps<'a'>,
            'onClick' | 'href' | 'to' | 'LinkComponent' | 'component'
          >)
      ),
    ref: React.Ref<HTMLButtonElement> | React.Ref<HTMLAnchorElement>
  ) {
    const { i18n } = useTranslation()
    const currentLang = hasLanguages ? i18n.language : undefined

    let url = prefixPathnameWithLang(routes[props.to].path, currentLang)

    if ('params' in props) {
      url = rrdGeneratePath(url, props.params)
    }

    if (props.options?.urlParams) {
      url = `${url}?${new URLSearchParams(props.options.urlParams).toString()}`
    }

    if (props.as === 'button') {
      const buttonProps = {
        ...omit(props, 'as', 'options', 'params'),
        ref,
        LinkComponent: RRDLink,
        to: url,
      } as MUIButtonProps

      return <Button {...buttonProps} />
    }

    const linkProps = {
      ...omit(props, 'as', 'options', 'params'),
      ref,
      component: RRDLink,
      to: url,
    } as MUILinkProps

    return <MUILink {...linkProps} />
  }

  return React.forwardRef(Link) as unknown as typeof Link
}
