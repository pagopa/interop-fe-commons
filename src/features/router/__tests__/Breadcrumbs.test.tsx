import React from 'react'
import { generateTestingRoutes, renderRoutes } from './common.mocks'
import { createMemoryHistory } from 'history'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectTypeOf, vi } from 'vitest'

const {
  routes,
  reactRouterDOMRoutes,
  components: { Breadcrumbs },
} = generateTestingRoutes()

const {
  reactRouterDOMRoutes: reactRouterDOMLocalizedRoutes,
  components: { Breadcrumbs: LocalizedBreadcrumbs },
} = generateTestingRoutes({ languages: ['it', 'en'] })

const routeLabels = {
  HOME: 'home',
  PAGE_1: 'page-1',
  PAGE_2: 'page-2',
  DYNAMIC_PAGE_1: 'dynamic-page-1',
  DYNAMIC_PAGE_2: 'dynamic-page-2',
  REDIRECT_1: 'redirect-1',
  REDIRECT_2: 'redirect-2',
} as const

const renderBreadcrumb = (startingRoute = '/page-1/test-id') => {
  const history = createMemoryHistory()
  history.push(startingRoute)
  const screen = renderRoutes(
    <Breadcrumbs routeLabels={routeLabels} />,
    reactRouterDOMRoutes,
    history
  )
  return { ...screen, history }
}

const renderLocalizedBreadcrumb = (startingRoute = '/it/page-1/test-id') => {
  const history = createMemoryHistory()
  history.push(startingRoute)
  const screen = renderRoutes(
    <LocalizedBreadcrumbs routeLabels={routeLabels} />,
    reactRouterDOMLocalizedRoutes,
    history
  )
  return { ...screen, history }
}

describe('Breadcrumbs', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderBreadcrumb()
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (localized)', () => {
    const history = createMemoryHistory()
    history.push('/page-1/test-id')
    const { baseElement } = renderLocalizedBreadcrumb()
    expect(baseElement).toMatchSnapshot()
  })

  it('should navigate to the correct route when clicking on a breadcrumb link', async () => {
    const { getByRole, getByText, history } = renderBreadcrumb()
    const page1Link = getByRole('link', { name: 'page-1' })
    const user = userEvent.setup()
    await user.click(page1Link)
    expect(history.location.pathname).toEqual('/page-1')
    expect(getByText('home')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'home' })).not.toBeInTheDocument()
  })

  it('should navigate to the correct route when clicking on a breadcrumb link (localized)', async () => {
    const { getByRole, getByText, history } = renderLocalizedBreadcrumb()
    const page1Link = getByRole('link', { name: 'page-1' })
    const user = userEvent.setup()
    await user.click(page1Link)
    expect(history.location.pathname).toEqual('/it/page-1')
    expect(getByText('home')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'home' })).not.toBeInTheDocument()
  })

  it('should have the correct routeLabels type', () => {
    type RouteLabels = Parameters<typeof Breadcrumbs>['0']['routeLabels']

    expectTypeOf<RouteLabels>().toMatchTypeOf<{ [K in keyof typeof routes]: string | false }>()
  })
})
