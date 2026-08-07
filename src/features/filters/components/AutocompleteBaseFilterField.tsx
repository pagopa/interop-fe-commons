import React from 'react'
import type { AutocompleteProps } from '@mui/material'
import { Autocomplete, Paper, Stack, TextField } from '@mui/material'
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
> & {
  label: string
  onInputChange?: (value: string) => void
  /**
   * Optional content prepended to the input's endAdornment (before the dropdown arrow).
   * Used by `AutocompleteMultipleFilterField` to render the count chip in `count-chip` variant.
   */
  endAdornmentExtra?: React.ReactNode
}

export const AutocompleteBaseFilterField = <Multiple extends boolean>(
  props: AutocompleteBaseFilterFieldProps<Multiple>
) => {
  const noOptionsText = getLocalizedValue({
    it: 'Nessun risultato trovato',
    en: 'No results',
  })

  const { endAdornmentExtra: _endAdornmentExtra, ...autocompleteProps } = props

  return (
    <Autocomplete<FilterOption, Multiple, true, false>
      {...autocompleteProps}
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
        const endAdornment = props.endAdornmentExtra ? (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {props.endAdornmentExtra}
            {params.InputProps.endAdornment}
          </Stack>
        ) : (
          params.InputProps.endAdornment
        )
        return (
          <TextField
            variant="outlined"
            {...params}
            label={props.label}
            InputProps={{ ...params.InputProps, endAdornment }}
          />
        )
      }}
    />
  )
}
