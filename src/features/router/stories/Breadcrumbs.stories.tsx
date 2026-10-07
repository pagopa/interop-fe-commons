import React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { InteropRouterBuilder } from '../interop-router-builder'

const { components } = new InteropRouterBuilder({ languages: ['it', 'en'] })
  .addRoute({
    key: 'HOME',
    path: '/',
    public: true,
    authLevels: ['user', 'admin'],
    element: <div>Home</div>,
  })
  .addRoute({
    key: 'PAGE_1',
    path: '/page-1',
    public: true,
    authLevels: ['user'],
    element: <div>Page 1</div>,
  })
  .addRoute({
    key: 'DYNAMIC_PAGE_1',
    path: '/page-1/:id',
    public: true,
    authLevels: ['user'],
    element: <div>Dynamic page</div>,
  })
  .build()

const Breadcrumbs = components.Breadcrumbs

const routeLabels = {
  HOME: 'Home',
  PAGE_1: 'Page 1',
  DYNAMIC_PAGE_1: 'Dynamic page 1',
} as const

const StoryWrapper = ({ initialPath = '/it/page-1/123' }: { initialPath?: string }) => (
  <MemoryRouter initialEntries={[initialPath]}>
    <Routes>
      <Route
        path="/*"
        element={
          <div style={{ padding: '1rem' }}>
            <Breadcrumbs routeLabels={routeLabels} />
          </div>
        }
      />
    </Routes>
  </MemoryRouter>
)

export default {
  title: 'Features/Router/Breadcrumbs',
  component: StoryWrapper,
  args: {
    initialPath: '/it/page-1/123',
  },
  argTypes: {
    initialPath: {
      control: 'text',
    },
  },
} as Meta<typeof StoryWrapper>

export const Default: StoryFn<typeof StoryWrapper> = (args) => <StoryWrapper {...args} />
