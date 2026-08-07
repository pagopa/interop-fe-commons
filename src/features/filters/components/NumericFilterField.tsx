import React from 'react'
import { IconButton, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { getLocalizedValue } from '../../../utils/common.utils'
import type { FilterFieldCommonProps, NumericFilterFieldOptions } from '../filters.types'

export const NumericFilterField: React.FC<FilterFieldCommonProps> = ({
  field: _field,
  value,
  onChangeActiveFilter,
  onFieldsValuesChange,
  hasSubmitButton,
}) => {
  const field = _field as NumericFilterFieldOptions
  const searchIconAriaLabel = getLocalizedValue({ it: 'Filtra', en: 'Filter' })
  const filterKey = field.name

  const getValue = () => {
    if (!value) return value
    const valueNum = Number(value)
    if (isNaN(valueNum)) return value

    if (field.min && valueNum < field.min) {
      return field.min.toString()
    }
    if (field.max && valueNum > field.max) {
      return field.max.toString()
    }

    return value
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const target = event.target as HTMLInputElement
    if (target.type === 'button') return

    target.blur()
    handleEnableNumericFilter()
  }

  const handleEnableNumericFilter = () => {
    onChangeActiveFilter('numeric', filterKey, getValue())
    onFieldsValuesChange(filterKey, '')
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterKey = event.currentTarget.name
    const value = event.currentTarget.value
    onFieldsValuesChange(filterKey, value)
  }

  const handleBlur = () => {
    onFieldsValuesChange(field.name, getValue())
  }

  return (
    <TextField
      size="small"
      type="number"
      label={field.label}
      name={field.name}
      value={value}
      onChange={handleTextFieldChange}
      onKeyDown={hasSubmitButton ? undefined : handleKeyDown}
      onBlur={handleBlur}
      InputProps={{
        inputProps: {
          min: field.min,
          max: field.max,
          style: { paddingRight: 20 },
        },
        endAdornment: hasSubmitButton ? undefined : (
          <IconButton disabled={!value} sx={{ mx: -1.5 }} onClick={handleEnableNumericFilter}>
            <SearchIcon aria-label={searchIconAriaLabel} />
          </IconButton>
        ),
      }}
    />
  )
}
