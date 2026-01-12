import React from 'react'
import type { AutocompleteProps } from '@mui/material'
import { Autocomplete, Paper, TextField } from '@mui/material'
import { getLocalizedValue } from '../../../utils/common.utils'
import type { FilterOption } from '../filters.types'

type AutocompleteBaseFilterFieldProps<Multiple extends boolean> = Omit<
  AutocompleteProps<FilterOption, Multiple, true, false>,
  | 'isOptionEqualToValue'
  | 'noOptionsText'
  | 'disableClearable'
  | 'renderTags'
  | 'PaperComponent'
  | 'size'
  | 'renderInput'
  | 'onInputChange'
> & { label: string; onInputChange?: (value: string) => void; hasSubmitButton?: boolean }

export const AutocompleteBaseFilterField = <Multiple extends boolean>(
  props: AutocompleteBaseFilterFieldProps<Multiple>
) => {
  const noOptionsText = getLocalizedValue({
    it: 'Nessun risultato trovato',
    en: 'No results',
  })

  function getSelectedElementsLabelText(): { label: string; ariaLabel: string } {
    let label = props.label
    let ariaLabel = props.label

    if (props.hasSubmitButton && Array.isArray(props.value) && props.value.length >= 1) {
      const selectedElements = props.value

      label = getLocalizedValue({
        it: `${props.label} (${selectedElements.length})`,
        en: `${props.label} (${selectedElements.length})`,
      })

      if (props.value.length === 1) {
        ariaLabel = getLocalizedValue({
          it: `${props.label} (${selectedElements.length} elemento selezionato)`,
          en: `${props.label} (${selectedElements.length} element selected)`,
        })
      }

      if (props.value.length > 1) {
        ariaLabel = getLocalizedValue({
          it: `${props.label} (${selectedElements.length} elementi selezionati)`,
          en: `${props.label} (${selectedElements.length} elements selected)`,
        })
      }
    }

    return { label, ariaLabel }
  }

  return (
    <Autocomplete<FilterOption, Multiple, true, false>
      {...props}
      onInputChange={(_, value) => props?.onInputChange?.(value)}
      isOptionEqualToValue={(option, { value }) => option.value === value}
      noOptionsText={noOptionsText}
      disableClearable
      renderTags={() => null}
      PaperComponent={({ children }) => <Paper elevation={4}>{children}</Paper>}
      size="small"
      onChange={(event, data, reason) => {
        // Avoids default behaviour of filters being removed on backspace press
        if (
          event.type === 'keydown' &&
          (event as React.KeyboardEvent).key === 'Backspace' &&
          reason === 'removeOption'
        ) {
          return
        }
        props.onChange?.(event, data, reason)
      }}
      renderInput={(params) => {
        return (
          <TextField
            variant="outlined"
            {...params}
            label={getSelectedElementsLabelText().label}
            aria-label={
              props.hasSubmitButton ? getSelectedElementsLabelText().ariaLabel : undefined
            }
          />
        )
      }}
    />
  )
}
