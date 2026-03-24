import React from 'react'
import type {
  FilterFields,
  FilterOption,
  FilterHandler,
  FiltersHandlers,
  FiltersParams,
  FiltersHandler,
  FilterFieldType,
} from '../filters.types'
import { useSearchParams } from 'react-router-dom'
import {
  encodeMultipleFilterFieldValue,
  decodeMultipleFilterFieldValue,
  mapSearchParamsToActiveFiltersAndFilterParams,
  encodeSingleFilterFieldValue,
} from '../filters.utils'

type FilterValue = Parameters<FilterHandler>[2]

function shouldRemoveFilter(type: FilterFieldType, value: FilterValue): boolean {
  if ((type === 'datepicker' || type === 'autocomplete-single') && value === null) {
    return true
  }
  if (
    ['freetext', 'autocomplete-multiple', 'numeric'].includes(type) &&
    (value as string | FilterOption[]).length === 0
  ) {
    return true
  }
  return false
}

function setFilterParam(
  searchParams: URLSearchParams,
  type: FilterFieldType,
  filterKey: string,
  value: FilterValue
): void {
  switch (type) {
    case 'numeric':
    case 'freetext': {
      searchParams.set(filterKey, String(value))
      break
    }
    case 'autocomplete-multiple': {
      const encoded = encodeMultipleFilterFieldValue(value as FilterOption[])
      searchParams.set(filterKey, encoded)
      break
    }
    case 'autocomplete-single': {
      const encoded = encodeSingleFilterFieldValue(value as FilterOption)
      searchParams.set(filterKey, encoded)
      break
    }
    case 'datepicker': {
      searchParams.set(filterKey, (value as Date).toISOString())
      break
    }
  }
}

/**
 * @description
 * This hook is used to manage the filters state keeping it in sync with the url params.
 * @param fields - The filters fields
 * @returns The filters params and the handlers to pass to the `Filter` component.
 * @example
 * const { filterParams, ...handlers } = useFilters([
 *  {
 *     name: 'name',
 *     type: 'freetext',
 *     label: 'Name',
 *  },
 *  {
 *     name: 'category',
 *     type: 'autocomplete-multiple',
 *     label: 'Category',
 *     options: [
 *       { label: 'Category 1', value: 'category-1' },
 *       { label: 'Category 2', value: 'category-2' },
 *       { label: 'Category 3', value: 'category-3' },
 *     ],
 *  },
 *  {
 *     name: 'date',
 *     type: 'datepicker',
 *     label: 'Date',
 *  },
 *  {
 *     name: 'price',
 *     type: 'numeric',
 *     label: 'Price',
 *  },
 *  {
 *     name: 'status',
 *     type: 'autocomplete-single',
 *     label: 'Status',
 *     options: [
 *       { label: 'Status 1', value: 'status-1' },
 *       { label: 'Status 2', value: 'status-2' },
 *       { label: 'Status 3', value: 'status-3' },
 *     ],
 *  },
 * ])
 *
 * return (
 *    <Filter {...handlers} />
 * )
 */
export function useFilters<TFiltersParams extends FiltersParams>(
  fields: FilterFields<Extract<keyof TFiltersParams, string>>
): FiltersHandlers & { filtersParams: TFiltersParams } {
  const [searchParams, setSearchParams] = useSearchParams()

  const onChangeActiveFilter = React.useCallback<FilterHandler>(
    (type, filterKey, value) => {
      setSearchParams((searchParams) => {
        if (shouldRemoveFilter(type, value)) {
          searchParams.delete(filterKey)
        } else {
          setFilterParam(searchParams, type, filterKey, value)
          searchParams.delete('offset')
        }
        return searchParams
      })
    },
    [setSearchParams]
  )

  const onSetActiveFilters = React.useCallback<FiltersHandler>(
    (fields, fieldsValues) => {
      setSearchParams((searchParams) => {
        let hasChanges = false

        fields.forEach((field) => {
          const { type, name: filterKey } = field
          const value = fieldsValues[filterKey]

          if (shouldRemoveFilter(type, value)) {
            searchParams.delete(filterKey)
          } else {
            setFilterParam(searchParams, type, filterKey, value)
            hasChanges = true
          }
        })

        if (hasChanges) {
          searchParams.delete('offset')
        }

        return searchParams
      })
    },
    [setSearchParams]
  )

  const onRemoveActiveFilter = React.useCallback<FilterHandler>(
    (type, filterKey, value) => {
      setSearchParams((searchParams) => {
        switch (type) {
          case 'freetext':
          case 'numeric':
          case 'datepicker':
          case 'autocomplete-single':
            searchParams.delete(filterKey)
            break
          case 'autocomplete-multiple':
            const urlParamsValue = searchParams.get(filterKey)
            if (urlParamsValue) {
              const values = decodeMultipleFilterFieldValue(urlParamsValue)
              const filteredValues = values.filter((option) => option.value !== value)
              if (filteredValues.length === 0) {
                searchParams.delete(filterKey)
              } else {
                searchParams.set(filterKey, encodeMultipleFilterFieldValue(filteredValues))
              }
            }
            break
        }
        searchParams.delete('offset')
        return searchParams
      })
    },
    [setSearchParams]
  )

  const onResetActiveFilters = React.useCallback(() => {
    setSearchParams((searchParams) => {
      const paramKeys = [...searchParams.keys()]
      paramKeys.forEach((paramKey) => {
        // Only delete the params that are related to filters
        const isFilterKey = fields.some((field) => field.name === paramKey)
        if (isFilterKey) {
          searchParams.delete(paramKey)
        }
      })
      return searchParams
    })
  }, [setSearchParams, fields])

  const { activeFilters, filtersParams } = mapSearchParamsToActiveFiltersAndFilterParams(
    searchParams,
    fields
  )

  return {
    fields,
    filtersParams: filtersParams as TFiltersParams,
    activeFilters,
    onResetActiveFilters,
    onChangeActiveFilter,
    onRemoveActiveFilter,
    onSetActiveFilters,
  }
}
