import React from 'react'
import itLocale from 'date-fns/locale/it'
import enLocale from 'date-fns/locale/en-US'
import { getLocalizedValue } from '../../../utils/common.utils'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
import type { DatepickerFilterFieldOptions, FilterFieldCommonProps } from '../filters.types'
import { isValidDate } from '../filters.utils'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputAdornment } from '@mui/material'

export const DatepickerFilterField: React.FC<FilterFieldCommonProps> = ({
  field: _field,
  value,
  onChangeActiveFilter,
  onFieldsValuesChange,
  hasSubmitButton,
}) => {
  const field = _field as DatepickerFilterFieldOptions
  const filterKey = field.name
  const adapterLocale = getLocalizedValue({ it: itLocale, en: enLocale })
  const searchIconAriaLabel = getLocalizedValue({ it: 'Filtra', en: 'Filter' })

  const enableDatepickerFilter = () => {
    if (!value || !isValidDate(value as Date)) return

    onChangeActiveFilter('datepicker', filterKey, value)
    onFieldsValuesChange(filterKey, null)
  }

  const handleDatepickerKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const target = event.target as HTMLInputElement
    if (target.type === 'button') return

    target.blur()
    enableDatepickerFilter()
  }

  const handleDatepickerChange = (data: Date | null) => {
    onFieldsValuesChange(filterKey, data)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <DesktopDateTimePicker
        ampm={false}
        value={value as Date | null}
        onChange={handleDatepickerChange}
        label={field.label}
        maxDate={field.maxDate}
        minDate={field.minDate}
        slots={{
          inputAdornment: (inputAdornmentProps) => (
            <>
              <InputAdornment {...inputAdornmentProps} />
              {!hasSubmitButton && (
                <IconButton
                  onClick={enableDatepickerFilter}
                  disabled={!value}
                  sx={{ mr: -1.5, ml: 1 }}
                >
                  <SearchIcon aria-label={searchIconAriaLabel} />
                </IconButton>
              )}
            </>
          ),
        }}
        slotProps={{
          textField: {
            size: 'small',
            onKeyDown: hasSubmitButton ? undefined : handleDatepickerKeyDown,
          },
        }}
      />
    </LocalizationProvider>
  )
}
