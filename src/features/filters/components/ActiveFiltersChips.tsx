import React from 'react'
import { Button, Chip, Divider, Stack } from '@mui/material'
import type { ActiveFilters, FiltersHandler } from '@/features/filters/filters.types'
import { getLocalizedValue } from '@/utils/common.utils'

type ActiveFilterChips = {
  activeFilters: ActiveFilters
  onRemoveActiveFilter: FiltersHandler
  onResetActiveFilters: VoidFunction
}

export const ActiveFilterChips: React.FC<ActiveFilterChips> = ({
  activeFilters,
  onRemoveActiveFilter,
  onResetActiveFilters,
}) => {
  if (activeFilters.length <= 0) return null

  const cancelFiltersLabel = getLocalizedValue({ it: 'Annulla filtri', en: 'Cancel filters' })

  return (
    <>
      <Divider sx={{ my: 1 }} />

      <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ width: '100%' }}>
        {activeFilters.map(({ value, label, type, filterKey }) => (
          <Chip
            key={value}
            label={label}
            onDelete={onRemoveActiveFilter.bind(null, type, filterKey, value)}
          />
        ))}
        {activeFilters.length > 1 && (
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
    </>
  )
}
