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
    // If the filter has no submit button, or if it has a submit button but the value is empty, the label is just the field label
    //  otherwise it shows the number of selected elements
    if (!props.hasSubmitButton || !Array.isArray(props.value) || props.value.length === 0) {
      return { label: props.label, ariaLabel: props.label }
    }

    const elementNumber = props.value.length

    const label = getLocalizedValue({
      it: `${props.label} (${elementNumber})`,
      en: `${props.label} (${elementNumber})`,
    })

    const ariaLabel = getLocalizedValue({
      it: `${props.label} (${elementNumber} ${
        elementNumber === 1 ? 'elemento selezionato' : 'elementi selezionati'
      })`,
      en: `${props.label} (${elementNumber} ${
        elementNumber === 1 ? 'element' : 'elements'
      } selected)`,
    })

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
