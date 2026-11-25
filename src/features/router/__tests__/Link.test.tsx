import React from 'react'
import { generateTestingRoutes, renderRoutes } from './common.mocks'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { expectTypeOf } from 'vitest'
import type { ExtractRouteParams } from '../router.types'

const {
  routes,
  reactRouterDOMRoutes,
  components: { Link },
} = generateTestingRoutes()

const {
  reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes,
  components: { Link: LocalizedLink },
} = generateTestingRoutes({ languages: ['it', 'en'] })

describe('Link', () => {
  it('should navigate to the correct route on click', async () => {
    const { history, getByRole } = renderRoutes(
      <Link to="PAGE_2">Go to page2</Link>,
      reactRouterDOMRoutes
    )
    const user = userEvent.setup()
    await user.click(getByRole('link'))
    expect(history.location.pathname).toEqual('/page-2')
  })

  it('should navigate to the correct localized route on click', async () => {
    const history = createMemoryHistory()
    history.push('/it/page-1')

    const { getByRole } = renderRoutes(
      <LocalizedLink to="PAGE_2">Go to page2</LocalizedLink>,
      reactRouterDOMLocalizedRoutes,
      history
    )

    const user = userEvent.setup()
    await user.click(getByRole('link'))
    expect(history.location.pathname).toEqual('/it/page-2')
  })

  it('should correctly navigate to dynamic routes on click', async () => {
    const { history, getByRole } = renderRoutes(
      <Link to="DYNAMIC_PAGE_1" params={{ id: 'test-id' }}>
        Go to dynamic page
      </Link>,
      reactRouterDOMRoutes
    )
    const user = userEvent.setup()
    await user.click(getByRole('link'))

    expect(history.location.pathname).toEqual('/page-1/test-id')
  })

  it('should set url params on navigation', async () => {
    const { history, getByRole } = renderRoutes(
      <Link
        to="DYNAMIC_PAGE_1"
        params={{ id: 'test-id' }}
        options={{ urlParams: { test: '1' } }}
      />,
      reactRouterDOMRoutes
    )

    const user = userEvent.setup()
    await user.click(getByRole('link'))

    expect(history.location.pathname).toEqual('/page-1/test-id')
    expect(history.location.search).toContain('test=1')
  })

  it('should set history state on navigation', async () => {
    const state = { from: 'page-1' }
    const { history, getByRole } = renderRoutes(
      <Link to="PAGE_2" options={{ state }}>
        Go to page2
      </Link>,
      reactRouterDOMRoutes
    )

    await userEvent.setup().click(getByRole('link'))

    expect(history.location.state).toEqual(state)
  })
})

describe('Link (as button)', () => {
  it('should navigate to the correct route on click', async () => {
    const { history, getByRole } = renderRoutes(
      <Link as="button" to="PAGE_2">
        Go to page2
      </Link>,
      reactRouterDOMRoutes
    )
    const user = userEvent.setup()
    await user.click(getByRole('link'))
    expect(history.location.pathname).toEqual('/page-2')
  })

  it('should correctly navigate to dynamic routes on click', async () => {
    const { history, getByRole } = renderRoutes(
      <Link as="button" to="DYNAMIC_PAGE_1" params={{ id: 'test-id' }}>
        Go to dynamic page
      </Link>,
      reactRouterDOMRoutes
    )
    const user = userEvent.setup()
    await user.click(getByRole('link'))

    expect(history.location.pathname).toEqual('/page-1/test-id')
  })

  it('should set url params on navigation', async () => {
    const { history, getByRole } = renderRoutes(
      <Link
        as="button"
        to="DYNAMIC_PAGE_1"
        params={{ id: 'test-id' }}
        options={{ urlParams: { test: '1' } }}
      />,
      reactRouterDOMRoutes
    )

    const user = userEvent.setup()
    await user.click(getByRole('link'))

    expect(history.location.pathname).toEqual('/page-1/test-id')
    expect(history.location.search).toContain('test=1')
  })

  it('should set history state on navigation', async () => {
    const state = { from: 'page-1' }
    const { history, getByRole } = renderRoutes(
      <Link as="button" to="PAGE_2" options={{ state }}>
        Go to page2
      </Link>,
      reactRouterDOMRoutes
    )

    await userEvent.setup().click(getByRole('link'))

    expect(history.location.state).toEqual(state)
  })

  it('should have the "to" prop typed correctly', () => {
    type ToProp = Parameters<typeof Link>['0']['to']
    expectTypeOf<ToProp>().toMatchTypeOf<keyof typeof routes>()
  })

  it('should have the "params" prop typed correctly', () => {
    type DynamicPageOnePathParameters = Parameters<typeof Link<'DYNAMIC_PAGE_1'>>['0']['params']
    expectTypeOf<DynamicPageOnePathParameters>().toMatchTypeOf<
      ExtractRouteParams<(typeof routes)['DYNAMIC_PAGE_1']['path']>
    >()

    type HomePagePathParameters = Parameters<typeof Link<'HOME'>>['0']
    expectTypeOf<HomePagePathParameters>().not.toMatchTypeOf<{ params: unknown }>()
  })
})
