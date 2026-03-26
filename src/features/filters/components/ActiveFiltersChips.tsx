import React from 'react'
import { Button, Chip, Divider, Stack } from '@mui/material'
import type { ActiveFilters, FilterHandler } from '../filters.types'
import { getLocalizedValue } from '../../../utils/common.utils'
import { blue } from '@mui/material/colors'

type ActiveFilterChipsProps = {
  activeFilters: ActiveFilters
  onRemoveActiveFilter: FilterHandler
  onResetActiveFilters: VoidFunction
  hasSubmitButton?: boolean
  rightContent?: React.ReactNode
}

const chipFocusStyles = {
  '&.Mui-focusVisible': {
    outline: `2px solid ${blue[400]}`,
    outlineOffset: '1px',
  },
}

const cancelFiltersLabel = getLocalizedValue({
  it: 'Annulla filtri',
  en: 'Cancel filters',
})

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  activeFilters,
  onRemoveActiveFilter,
  onResetActiveFilters,
  hasSubmitButton,
  rightContent,
}) => {
  if (activeFilters.length === 0 && !rightContent) return null

  const showResetButton = !hasSubmitButton && activeFilters.length > 1

  return (
    <>
      <Divider sx={{ my: 2 }} />

      <Stack
        spacing={rightContent ? 2 : 0}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ width: '100%' }}>
          {activeFilters.map(({ value, label, type, filterKey }) => (
            <Chip
              key={`${filterKey}-${value}`}
              label={label}
              sx={chipFocusStyles}
              onDelete={() => onRemoveActiveFilter(type, filterKey, value)}
            />
          ))}
          {showResetButton && (
            <Button
              sx={{ ml: 2 }}
              size="small"
              type="button"
              variant="naked"
              onClick={onResetActiveFilters}
            >
              {cancelFiltersLabel}
            </Button>
          )}
        </Stack>
        {rightContent}
      </Stack>
    </>
  )
}
