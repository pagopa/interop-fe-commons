import React from 'react'
import type { Meta, StoryFn } from '@storybook/react'
import { PaginationExample } from './PaginationExample'

export default {
  title: 'Features/Pagination',
  component: PaginationExample,
} as Meta<typeof PaginationExample>

export const Pagination: StoryFn = () => <PaginationExample />
export const PaginationWithRowsPerTable: StoryFn = () => <PaginationExample withRowsPerPage />
