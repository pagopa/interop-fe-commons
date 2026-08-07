import React from 'react'
import { Checkbox } from '@mui/material'
import type {
  AutocompleteFilterFieldOptions,
  FilterFieldCommonProps,
  FilterFieldsValues,
  FilterOption,
} from '../filters.types'
import { AutocompleteBaseFilterField } from './AutocompleteBaseFilterField'

export const AutocompleteMultipleFilterField: React.FC<FilterFieldCommonProps> = ({
  field: _field,
  value,
  onChangeActiveFilter,
  onFieldsValuesChange,
  hasSubmitButton,
}) => {
  const field = _field as AutocompleteFilterFieldOptions
  const filterKey = field.name

  const debounceRef = React.useRef<NodeJS.Timeout>()

  const handleAutocompleteMultipleChange = (data: FilterFieldsValues['string']) => {
    onFieldsValuesChange(filterKey, data)
    if (!hasSubmitButton) {
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(
        () => onChangeActiveFilter('autocomplete-multiple', filterKey, data),
        300
      )
    }
  }

  return (
    <AutocompleteBaseFilterField<true>
      multiple
      label={field.label}
      value={value as FilterOption[]}
      options={field.options}
      disableCloseOnSelect
      onInputChange={field?.onTextInputChange}
      onChange={(_, data) => {
        handleAutocompleteMultipleChange(data)
      }}
      renderOption={(props, option, { selected }) => {
        const label = option.label
        if (!label) return null

        return (
          <li {...props}>
            <Checkbox key={option.value} checked={selected} name={label} />
            {label}
          </li>
        )
      }}
      hasSubmitButton={hasSubmitButton}
    />
  )
}
