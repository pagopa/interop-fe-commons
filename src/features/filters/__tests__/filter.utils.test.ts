import type { FilterFields } from '@/features/filters/filters.types'
import {
  encodeMultipleFilterFieldValue,
  decodeMultipleFilterFieldValue,
  getFiltersFieldsDefaultValue,
  getFiltersFieldsInitialValues,
  mapSearchParamsToActiveFiltersAndFilterParams,
  decodeSingleFilterFieldValue,
  encodeSingleFilterFieldValue,
} from '@/features/filters/filters.utils'

const fieldMocks: FilterFields = [
  { name: 'single-field', type: 'freetext', label: 'Single Filter Field' },
  {
    name: 'multiple-field',
    type: 'autocomplete-multiple',
    options: [],
    label: 'Multiple Filter Field',
  },
  {
    name: 'autocomplete-single-field',
    type: 'autocomplete-single',
    options: [],
    label: 'Single Filter Field',
  },
  {
    name: 'numeric-field',
    type: 'numeric',
    label: 'Numeric Filter Field',
  },
  {
    name: 'datepicker-field',
    type: 'datepicker',
    label: 'Datepicker Field',
  },
  {
    name: 'numeric-field',
    type: 'numeric',
    label: 'Numeric Filter Field',
  },
]

describe('getFiltersFieldsDefaultValue testing', () => {
  it('should create the correct default value based on the field type', () => {
    const result = getFiltersFieldsDefaultValue(fieldMocks)

    expect(result).toEqual({
      'autocomplete-single-field': null,
      'datepicker-field': null,
      'single-field': '',
      'multiple-field': [],
      'numeric-field': '',
    })
  })
})

describe('getFiltersFieldsInitialValues testing', () => {
  it('should get the correct field initial values from the passed search url params', () => {
    const date = new Date()
    const searchParams = new URLSearchParams({
      'numeric-field': '200',
      'datepicker-field': JSON.stringify(date),
      'single-field': 'testing',
      'multiple-field': JSON.stringify([
        ['Option 1', 'option-1'],
        ['Option 2', 'option-2'],
      ]),
      'autocomplete-single-field': JSON.stringify(['Option 1', 'option-1']),
    })
    const result = getFiltersFieldsInitialValues(searchParams, fieldMocks)

    expect(result).toEqual({
      'single-field': '',
      'datepicker-field': null,
      'numeric-field': '',
      'multiple-field': [
        {
          label: 'Option 1',
          value: 'option-1',
        },
        {
          label: 'Option 2',
          value: 'option-2',
        },
      ],
    })
  })

  it('should get the correct field initial values when there are no search params', () => {
    const searchParams = new URLSearchParams({})
    const result = getFiltersFieldsInitialValues(searchParams, fieldMocks)

    expect(result).toEqual({
      'datepicker-field': null,
      'single-field': '',
      'numeric-field': '',
      'multiple-field': [],
    })
  })
})

describe('encodeMultipleFilterFieldValue testing', () => {
  it('should correctly map multiple filter field values to search params value', () => {
    const result = encodeMultipleFilterFieldValue([
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
    ])
    expect(result).toEqual('[["Option 1","option-1"],["Option 2","option-2"]]')
  })
})

describe('decodeMultipleFilterFieldValue testing', () => {
  it('should correctly map search params value to multiple filter field values', () => {
    const result = decodeMultipleFilterFieldValue(
      '[["Option 1","option-1"],["Option 2","option-2"]]'
    )
    expect(result).toEqual([
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
    ])
  })
})

describe('encodeSingleFilterFieldValue testing', () => {
  it('should correctly map single filter field values to search params value', () => {
    const result = encodeSingleFilterFieldValue({ label: 'Option 1', value: 'option-1' })
    expect(result).toEqual('["Option 1","option-1"]')
  })
})

describe('decodeSingleFilterFieldValue testing', () => {
  it('should correctly map search params value to single filter field values', () => {
    const result = decodeSingleFilterFieldValue('["Option 1","option-1"]')
    expect(result).toEqual({ label: 'Option 1', value: 'option-1' })
  })
})

describe('mapSearchParamsToActiveFiltersAndFilterParams testing', () => {
  it('should return empty activeFilters and filtersParams if no filter has been set in the search params', () => {
    const searchParams = new URLSearchParams()
    const fields: FilterFields = []
    const result = mapSearchParamsToActiveFiltersAndFilterParams(searchParams, fields)
    expect(result).toMatchInlineSnapshot(`
      {
        "activeFilters": [],
        "filtersParams": {},
      }
    `)
  })

  it('should ignore empty array/strings', () => {
    const searchParams = new URLSearchParams({
      'single-field': '',
      'multiple-field': '[]',
    })
    const result = mapSearchParamsToActiveFiltersAndFilterParams(searchParams, fieldMocks)
    expect(result).toMatchInlineSnapshot(`
      {
        "activeFilters": [],
        "filtersParams": {},
      }
    `)
  })

  it('should correctly map the active filters search url params', () => {
    const searchParams = new URLSearchParams({
      'single-field': 'test-value',
      'multiple-field': '[["Option 1","option-1"],["Option 2","option-2"]]',
      'autocomplete-single-field': '["Option 1","option-1"]',
      'numeric-field': '200',
    })
    const result = mapSearchParamsToActiveFiltersAndFilterParams(searchParams, fieldMocks)
    expect(result).toMatchInlineSnapshot(`
      {
        "activeFilters": [
          {
            "filterKey": "single-field",
            "label": "test-value",
            "type": "freetext",
            "value": "test-value",
          },
          {
            "filterKey": "multiple-field",
            "label": "Option 1",
            "type": "autocomplete-multiple",
            "value": "option-1",
          },
          {
            "filterKey": "multiple-field",
            "label": "Option 2",
            "type": "autocomplete-multiple",
            "value": "option-2",
          },
          {
            "filterKey": "autocomplete-single-field",
            "label": "Option 1",
            "type": "autocomplete-single",
            "value": "option-1",
          },
          {
            "filterKey": "numeric-field",
            "label": "200",
            "type": "numeric",
            "value": "200",
          },
          {
            "filterKey": "numeric-field",
            "label": "200",
            "type": "numeric",
            "value": "200",
          },
        ],
        "filtersParams": {
          "autocomplete-single-field": "option-1",
          "multiple-field": [
            "option-1",
            "option-2",
          ],
          "numeric-field": "200",
          "single-field": "test-value",
        },
      }
    `)
  })
})
