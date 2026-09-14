import React from 'react'
import { createMemoryHistory, type History } from 'history'
import { Route, Router, Routes } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { theme as MUIITaliaTheme } from '@pagopa/mui-italia'
// import { theme } from '@/theme'

interface TestingRouterWrapper {
  children: React.ReactNode
  history?: History
}

export const TestingRouterWrapper: React.FC<TestingRouterWrapper> = ({
  children,
  history: _history,
}) => {
  const history = _history ?? createMemoryHistory()

  return (
    <ThemeProvider theme={MUIITaliaTheme}>
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route path="*" element={children} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export const renderWithRouter = (component: Parameters<typeof render>[0], _history?: History) => {
  const history = _history ?? createMemoryHistory()
  const renderReturn = render(component, {
    wrapper: ({ children }) => (
      <TestingRouterWrapper history={history}>{children}</TestingRouterWrapper>
    ),
  })
  return { ...renderReturn, history }
}
