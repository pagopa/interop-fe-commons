import React from 'react'
import { Checkbox, Chip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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
}) => {
  const field = _field as AutocompleteFilterFieldOptions
  const filterKey = field.name
  const selected = (value as FilterOption[]) ?? []

  const debounceRef = React.useRef<NodeJS.Timeout>()

  const commit = (data: FilterFieldsValues['string']) => {
    onFieldsValuesChange(filterKey, data)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () => onChangeActiveFilter('autocomplete-multiple', filterKey, data),
      300
    )
  }

  const countChip =
    selected.length > 0 ? (
      <Chip
        size="small"
        color="primary"
        label={selected.length}
        onDelete={(e) => {
          e.stopPropagation()
          commit([])
        }}
        deleteIcon={<CloseIcon />}
      />
    ) : null

  return (
    <AutocompleteBaseFilterField<true>
      multiple
      label={field.label}
      value={selected}
      options={field.options}
      disableCloseOnSelect
      endAdornmentExtra={countChip}
      onInputChange={field?.onTextInputChange}
      onChange={(_, data) => {
        commit(data)
      }}
      renderOption={(props, option, { selected: isSelected }) => {
        const label = option.label
        if (!label) return null

        return (
          <li {...props}>
            <Checkbox key={option.value} checked={isSelected} name={label} />
            {label}
          </li>
        )
      }}
    />
  )
}
