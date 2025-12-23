import React from 'react'
import type {
  FilterFields,
  FilterOption,
  FilterHandler,
  FiltersHandlers,
  FiltersParams,
  FiltersHandler,
} from '../filters.types'
import { useSearchParams } from 'react-router-dom'
import {
  encodeMultipleFilterFieldValue,
  decodeMultipleFilterFieldValue,
  mapSearchParamsToActiveFiltersAndFilterParams,
  encodeSingleFilterFieldValue,
} from '../filters.utils'

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
        let shouldBeRemoved = false
        if (type === 'datepicker' && value === null) {
          shouldBeRemoved = true
        }
        if (
          ['freetext', 'autocomplete-multiple', 'numeric'].includes(type) &&
          (value as string | Array<FilterOption>).length === 0
        ) {
          shouldBeRemoved = true
        }
        if (shouldBeRemoved) {
          searchParams.delete(filterKey)
          return searchParams
        }

        switch (type) {
          case 'numeric':
          case 'freetext':
            searchParams.set(filterKey, String(value))
            break
          case 'autocomplete-multiple':
            const urlParamMultipleFilterValue = encodeMultipleFilterFieldValue(
              value as Array<FilterOption>
            )
            searchParams.set(filterKey, urlParamMultipleFilterValue)
            break
          case 'autocomplete-single':
            const urlParamSingleFilterValue = encodeSingleFilterFieldValue(value as FilterOption)
            searchParams.set(filterKey, urlParamSingleFilterValue)
            break
          case 'datepicker':
            searchParams.set(filterKey, (value as Date).toISOString())
            break
        }
        searchParams.delete('offset')
        return searchParams
      })
    },
    [setSearchParams]
  )

  const onSetActiveFilters = React.useCallback<FiltersHandler>(
    (fields, fieldsValues) => {
      // fields.forEach((field) => {
      //   onChangeActiveFilter(field.type, field.name, fieldsValues[field.name])
      // })
      setSearchParams((searchParams) => {
        console.log('Setting active filters...', searchParams.toString())
        console.log('Fields values:', fieldsValues)
        fields.forEach((field) => {
          const value = fieldsValues[field.name]
          const type = field.type
          const filterKey = field.name
          console.log('data', filterKey, type, value)
          let shouldBeRemoved = false
          if ((type === 'datepicker' || type === 'autocomplete-single') && value === null) {
            shouldBeRemoved = true
          }
          if (
            ['freetext', 'autocomplete-multiple', 'numeric'].includes(type) &&
            (value as string | Array<FilterOption>).length === 0
          ) {
            shouldBeRemoved = true
          }
          if (shouldBeRemoved) {
            searchParams.delete(filterKey)
          }

          if (!shouldBeRemoved) {
            console.log('Setting param:', shouldBeRemoved, filterKey, value)
            switch (type) {
              case 'numeric':
              case 'freetext':
                searchParams.set(filterKey, String(value))
                break
              case 'autocomplete-multiple':
                const urlParamMultipleFilterValue = encodeMultipleFilterFieldValue(
                  value as Array<FilterOption>
                )
                searchParams.set(filterKey, urlParamMultipleFilterValue)
                break
              case 'autocomplete-single':
                const urlParamSingleFilterValue = encodeSingleFilterFieldValue(
                  value as FilterOption
                )
                searchParams.set(filterKey, urlParamSingleFilterValue)
                break
              case 'datepicker':
                searchParams.set(filterKey, (value as Date).toISOString())
                break
            }
            searchParams.delete('offset')
            console.log('Updated search params:', searchParams.toString())
          }
        })
        console.log('Final search params after setting active filters:', searchParams.toString())
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
