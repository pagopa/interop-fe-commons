import React from 'react'
import { Button, Grid } from '@mui/material'
import type {
  FilterFieldValue,
  FilterFieldsValues,
  FilterFields,
  FilterHandler,
} from '../filters.types'
import { AutocompleteMultipleFilterField } from './AutocompleteMultipleFilterField'
import { AutocompleteSingleFilterField } from './AutocompleteSingleFilterField'
import { DatepickerFilterField } from './DatepickerFilterField'
import { NumericFilterField } from './NumericFilterField'
import { FreetextFilterField } from './FreetextFilterField'
import { getLocalizedValue } from '@/utils/common.utils'

/**
 * The default width of the filter field in a 12-column grid system.
 */
const filterFieldDefaultWidth = 3

type FiltersFieldsProps = {
  fields: FilterFields
  onChangeActiveFilter: FilterHandler
  fieldsValues: FilterFieldsValues
  onFieldsValuesChange: (name: string, value: FilterFieldValue) => void
  onResetActiveFilters: VoidFunction
  onSubmit: VoidFunction
  hasSubmitButton?: boolean
}

export const FiltersFields: React.FC<FiltersFieldsProps> = ({
  fields,
  fieldsValues,
  onFieldsValuesChange,
  onChangeActiveFilter,
  onResetActiveFilters,
  onSubmit,
  hasSubmitButton,
}) => {
  const cancelFiltersLabel = getLocalizedValue({
    it: 'Annulla filtri',
    en: 'Cancel filters',
  })

  const submitFiltersLabel = getLocalizedValue({
    it: 'Filtra',
    en: 'Filter',
  })

  const buttonDisabled = Object.entries(fieldsValues).every(
    ([_, value]) => value === null || value === '' || (Array.isArray(value) && value.length === 0)
  )

  return (
    <Grid container spacing={2}>
      {fields.map((field) => {
        const fieldProps = {
          field,
          value: fieldsValues[field.name],
          onChangeActiveFilter,
          onFieldsValuesChange,
          hasSubmitButton,
        }
        return (
          <Grid item xs={field.width ?? filterFieldDefaultWidth} key={field.name}>
            {field.type === 'freetext' && <FreetextFilterField {...fieldProps} />}
            {field.type === 'numeric' && <NumericFilterField {...fieldProps} />}
            {field.type === 'autocomplete-multiple' && (
              <AutocompleteMultipleFilterField {...fieldProps} />
            )}
            {field.type === 'autocomplete-single' && (
              <AutocompleteSingleFilterField {...fieldProps} />
            )}
            {field.type === 'datepicker' && <DatepickerFilterField {...fieldProps} />}
          </Grid>
        )
      })}
      {hasSubmitButton && (
        <Grid item xs={3} alignContent="center">
          <Button
            size="small"
            type="button"
            variant="outlined"
            onClick={onSubmit}
            disabled={buttonDisabled}
          >
            {submitFiltersLabel}
          </Button>
          <Button
            sx={{ ml: 2 }}
            size="small"
            type="button"
            variant="naked"
            onClick={onResetActiveFilters}
            disabled={buttonDisabled}
          >
            {cancelFiltersLabel}
          </Button>
        </Grid>
      )}
    </Grid>
  )
}
