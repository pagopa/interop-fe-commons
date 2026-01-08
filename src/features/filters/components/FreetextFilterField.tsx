import React from 'react'
import { IconButton, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { getLocalizedValue } from '../../../utils/common.utils'
import type { FilterFieldCommonProps } from '../filters.types'

export const FreetextFilterField: React.FC<FilterFieldCommonProps> = ({
  field,
  value,
  onChangeActiveFilter,
  onFieldsValuesChange,
  hasSubmitButton,
}) => {
  const searchIconAriaLabel = getLocalizedValue({ it: 'Filtra', en: 'Filter' })
  const filterKey = field.name

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const target = event.target as HTMLInputElement
    if (target.type === 'button') return

    target.blur()
    handleEnableFreetextFilter()
  }

  const handleEnableFreetextFilter = () => {
    onChangeActiveFilter('freetext', filterKey, value)
    onFieldsValuesChange(filterKey, '')
  }

  const handleFieldValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterKey = event.currentTarget.name
    const value = event.currentTarget.value
    onFieldsValuesChange(filterKey, value)
  }

  return (
    <TextField
      size="small"
      label={field.label}
      name={field.name}
      value={value}
      onChange={handleFieldValueChange}
      onKeyDown={hasSubmitButton ? undefined : handleKeyDown}
      InputProps={{
        endAdornment: hasSubmitButton ? undefined : (
          <IconButton disabled={!value} sx={{ mx: -1.5 }} onClick={handleEnableFreetextFilter}>
            <SearchIcon aria-label={searchIconAriaLabel} />
          </IconButton>
        ),
      }}
    />
  )
}
