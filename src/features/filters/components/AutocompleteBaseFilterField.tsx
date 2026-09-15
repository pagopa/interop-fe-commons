import React from 'react'
import type { AutocompleteProps, SxProps as MuiSxProps } from '@mui/material'
import {
  Autocomplete as MIAutocomplete,
  type AutocompleteProps as MIAutocompleteProps,
} from '@pagopa/mui-italia'
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
> & { label: string; onInputChange?: (value: string) => void }

export const AutocompleteBaseFilterField = <Multiple extends boolean>(
  props: AutocompleteBaseFilterFieldProps<Multiple>
) => {
  const lastPressedKeyRef = React.useRef<string | null>(null)

  const {
    label: fieldLabel,
    onInputChange,
    onChange,
    renderOption,
    options,
    value,
    sx,
    slotProps: _slotProps,
    defaultValue: _defaultValue,
    blurOnSelect: _blurOnSelect,
    disableCloseOnSelect: _disableCloseOnSelect,
    ...autocompleteProps
  } = props

  const noOptionsText = getLocalizedValue({
    it: 'Nessun risultato trovato',
    en: 'No results',
  })

  function handleAutocompleteChange(
    newValue: MIAutocompleteProps<FilterOption, Multiple>['value'] | undefined
  ) {
    if (newValue === undefined) {
      return
    }

    // Avoid default behaviour of filters being removed on backspace press.
    if (
      lastPressedKeyRef.current === 'Backspace' &&
      Array.isArray(value) &&
      Array.isArray(newValue) &&
      newValue.length < value.length
    ) {
      lastPressedKeyRef.current = null
      return
    }

    lastPressedKeyRef.current = null

    onChange?.(
      { type: 'change' } as React.SyntheticEvent,
      newValue as NonNullable<AutocompleteProps<FilterOption, Multiple, true, false>['value']>,
      'selectOption'
    )
  }

  function renderAutocompleteOption(option: FilterOption) {
    if (!renderOption) {
      return null
    }

    const isSelected = Array.isArray(value)
      ? value.some((selectedOption) => selectedOption.value === option.value)
      : value?.value === option.value

    return renderOption(
      { key: option.value } as React.HTMLAttributes<HTMLLIElement> & { key: string },
      option,
      { selected: isSelected, inputValue: '', index: 0 },
      {} as never
    )
  }

  return (
    <MIAutocomplete<FilterOption, Multiple>
      {...autocompleteProps}
      options={[...options]}
      label={fieldLabel}
      sx={sx as unknown as MuiSxProps}
      value={value as Multiple extends true ? FilterOption[] : FilterOption}
      getOptionLabel={(option) => option.label}
      onInputChange={(inputValue) => onInputChange?.(inputValue)}
      isOptionEqualToValue={(option, { value }) => option.value === value}
      noResultsText={noOptionsText}
      showSelectionCountOnly={true}
      onKeyDown={(event) => {
        lastPressedKeyRef.current = event.key
        autocompleteProps.onKeyDown?.(event)
      }}
      onChange={handleAutocompleteChange}
      renderOption={renderOption ? renderAutocompleteOption : undefined}
    />
  )
}
