import React from 'react'
import type { InputBaseComponentProps } from '@mui/material'
import {
  MenuItem,
  Pagination as MUIPagination,
  Select,
  Stack,
  type StackProps,
  type SxProps,
} from '@mui/material'
import type { InteropTheme } from '@/theme'

const defaultOptions = [10, 24, 36]
export interface PaginationProps extends StackProps {
  totalPages: number
  pageNum: number
  sx?: SxProps<InteropTheme>
  rowPerPageOptions?: {
    options?: number[]
    onLimitChange: (limit: number) => void
    limit: number
    inputProps?: InputBaseComponentProps
  }

  onPageChange: (numPage: number) => void
}

/**
 * Renders a pagination component, here should be passed the `paginationProps` property returned from the `usePagination` hook.
 */
export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
  pageNum,
  sx,
  rowPerPageOptions,
  ...stackProps
}) => {
  const pageOptionsValues = rowPerPageOptions?.options || defaultOptions

  if (totalPages <= 1) return null
  return (
    <Stack
      sx={{ mt: 2, ...sx }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      {...stackProps}
    >
      {rowPerPageOptions && (
        <Select
          size="small"
          labelId="rows-per-page-select"
          id="rows-per-page-select"
          data-testid="rows-per-page-select"
          value={rowPerPageOptions.limit}
          inputProps={{
            'aria-label': 'Select number of rows per page',
            ...rowPerPageOptions?.inputProps,
          }}
          onChange={(event) => rowPerPageOptions.onLimitChange(event.target.value as number)}
        >
          {pageOptionsValues.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      )}

      <MUIPagination
        color="primary"
        page={pageNum}
        count={totalPages}
        onChange={(_, page) => onPageChange(page)}
      />
    </Stack>
  )
}
