import React from 'react'
import { Button, Chip, Divider, Stack } from '@mui/material'
import type { ActiveFilters, FilterHandler } from '../filters.types'
import { getLocalizedValue } from '../../../utils/common.utils'

type ActiveFilterChips = {
  activeFilters: ActiveFilters
  onRemoveActiveFilter: FilterHandler
  onResetActiveFilters: VoidFunction
  hasSubmitButton?: boolean
  rightContent?: React.ReactNode
}

export const ActiveFilterChips: React.FC<ActiveFilterChips> = ({
  activeFilters,
  onRemoveActiveFilter,
  onResetActiveFilters,
  hasSubmitButton,
  rightContent,
}) => {
  if (activeFilters.length <= 0 && !rightContent) return null

  const cancelFiltersLabel = getLocalizedValue({
    it: 'Annulla filtri',
    en: 'Cancel filters',
  })

  return (
    <>
      <Divider sx={{ my: 1 }} />

      <Stack
        spacing={rightContent ? 2 : 0}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ width: '100%' }}>
          {activeFilters.map(({ value, label, type, filterKey }) => (
            <Chip
              key={filterKey + value}
              label={label}
              onDelete={onRemoveActiveFilter.bind(null, type, filterKey, value)}
            />
          ))}
          {!hasSubmitButton && activeFilters.length > 1 && (
            <Stack justifyContent="center">
              <Button
                sx={{ ml: 2 }}
                size="small"
                type="button"
                variant="naked"
                onClick={onResetActiveFilters}
              >
                {cancelFiltersLabel}
              </Button>
            </Stack>
          )}
        </Stack>
        {rightContent}
      </Stack>
    </>
  )
}
