import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
// extends Vitest's expect method with methods from react-testing-library
import '@testing-library/jest-dom/vitest'

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

vi.spyOn(global.console, 'error').mockImplementation(() => vi.fn())
vi.spyOn(global.console, 'warn').mockImplementation(() => vi.fn())

vi.mock('react-i18next')

vi.mock('@pagopa/mui-italia', async () => {
  const React = await import('react')

  return {
    theme: {},
    CopyToClipboardButton: ({ value, ...props }) =>
      React.createElement('button', { type: 'button', 'data-value': value, ...props }, 'Copy'),
    MIBreadcrumbs: ({ children }) => {
      const items = React.Children.toArray(children)
      const content = items.flatMap((child, index) => {
        const elements = [React.createElement('li', { key: `item-${index}` }, child)]

        if (index < items.length - 1) {
          elements.push(
            React.createElement('li', { key: `separator-${index}`, 'aria-hidden': 'true' }, '/')
          )
        }

        return elements
      })

      return React.createElement('nav', undefined, React.createElement('ol', undefined, content))
    },
    MIBreadcrumbItem: ({ label, current, onClick }) =>
      current
        ? React.createElement('span', { 'aria-current': 'page' }, label)
        : React.createElement(
            'a',
            {
              href: '#',
              onClick: (event) => {
                event.preventDefault()
                onClick?.()
              },
            },
            label
          ),
  }
})
