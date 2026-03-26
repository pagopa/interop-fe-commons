import type {
  ActiveFilters,
  FilterFieldsValues,
  FilterFields,
  FilterOption,
  FiltersParams,
  FilterField,
} from './filters.types'

/** Map passed fields options to the field state default value */
export function getFiltersFieldsDefaultValue(fields: FilterFields): FilterFieldsValues {
  return fields.reduce<FilterFieldsValues>((acc, field) => {
    switch (field.type) {
      case 'autocomplete-multiple':
        acc[field.name] = []
        break
      case 'autocomplete-single':
      case 'datepicker':
        acc[field.name] = null
        break
      default:
        acc[field.name] = ''
    }
    return acc
  }, {})
}

/**
 * Get the filter's field initial values object from search params.
 * The initial value of fields of type "single" will always be an empty string,
 * while the initial value of fields of type "multiple" will depend on the
 * url search params
 */
export const getFiltersFieldsInitialValues = (
  searchParams: URLSearchParams,
  filtersFields: FilterFields,
  hasSubmitButton?: boolean
) => {
  const fieldsValues: FilterFieldsValues = {}
  filtersFields.forEach((field) => {
    switch (field.type) {
      case 'autocomplete-multiple':
        const multipleFilterParamValue = searchParams.get(field.name)
        if (multipleFilterParamValue) {
          fieldsValues[field.name] = decodeMultipleFilterFieldValue(multipleFilterParamValue)
          return
        }
        fieldsValues[field.name] = []
        break
      case 'autocomplete-single':
        // autocomplete single has no need to be in the fields state when no submit button
        if (hasSubmitButton) {
          const singleFilterParamValue = searchParams.get(field.name)
          if (singleFilterParamValue) {
            fieldsValues[field.name] = decodeSingleFilterFieldValue(singleFilterParamValue)
            return
          }
          fieldsValues[field.name] = null
        }
        break
      case 'freetext':
      case 'numeric':
        fieldsValues[field.name] = ''
        break
      case 'datepicker':
        fieldsValues[field.name] = null
        break
    }
  })

  return fieldsValues
}

export const encodeSingleFilterFieldValue = ({ label, value }: FilterOption) =>
  JSON.stringify([label, value])

export const decodeSingleFilterFieldValue = (urlParamValue: string) => {
  const parsedSearchParams = JSON.parse(urlParamValue) as [string, string]
  return { label: parsedSearchParams[0], value: parsedSearchParams[1] }
}

/**
 * Gets the array of selected filter options and encode them to string with the following format:
 * "[[_OPTION_1_LABEL_, _OPTION_1_VALUE_], [_OPTION_2_LABEL_, _OPTION_2_VALUE_], ...]"
 * */
export const encodeMultipleFilterFieldValue = (value: Array<FilterOption>) => {
  return JSON.stringify(value.map(({ value, label }) => [label, value]))
}

/** Decode the encoded multiple filter field value to an Array<FilterOption> data type */
export const decodeMultipleFilterFieldValue = (urlParamValue: string): Array<FilterOption> => {
  const parsedSearchParams = JSON.parse(urlParamValue) as Array<[string, string]>
  return parsedSearchParams.map((field) => ({
    label: field[0],
    value: field[1],
  }))
}

/**
 * maps the passed searchParams to:
 * - activeFilters: an array used to render the filters chips in the Filters component;
 * - filtersParams: the filters that should be passed as url params to the query request.
 */
export const mapSearchParamsToActiveFiltersAndFilterParams = (
  searchParams: URLSearchParams,
  filtersFields: FilterFields
) => {
  const activeFilters: ActiveFilters = []
  const filtersParams: FiltersParams = {}

  filtersFields.forEach((field) => {
    const filterValue = searchParams.get(field.name)
    if (filterValue) {
      switch (field.type) {
        case 'autocomplete-multiple':
          const decodedFilterValue = decodeMultipleFilterFieldValue(filterValue)
            .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
            .map((option) => ({
              ...option,
              type: field.type,
              filterKey: field.name,
            }))

          if (decodedFilterValue.length === 0) return

          activeFilters.push(...decodedFilterValue)
          filtersParams[field.name] = decodedFilterValue.map(({ value }) => value)
          break
        case 'autocomplete-single':
          const decodedValue = decodeSingleFilterFieldValue(filterValue)
          activeFilters.push({
            ...decodedValue,
            type: field.type,
            filterKey: field.name,
          })
          filtersParams[field.name] = decodedValue.value
          break
        case 'numeric':
        case 'freetext':
          activeFilters.push({
            value: filterValue,
            label: filterValue,
            type: field.type,
            filterKey: field.name,
          })
          filtersParams[field.name] = filterValue
          break
        case 'datepicker':
          activeFilters.push({
            value: filterValue,
            label: formatDateTime(new Date(filterValue)),
            type: field.type,
            filterKey: field.name,
          })
          filtersParams[field.name] = filterValue
          break
        default:
          new Error(
            `Parsing search param value to filterParams/activeFilter not implemented for ${
              (field as FilterField).type
            }`
          )
      }
    }
  })

  return { activeFilters, filtersParams }
}

const dateTimeFormatter = new Intl.DateTimeFormat('it', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatDateTime(date: Date) {
  return dateTimeFormatter.format(date)
}

export function isValidDate(date: Date) {
  return date instanceof Date && !isNaN(date.getTime())
}
