import React from 'react'
import { CodeBlock, Filters, useAutocompleteTextInput, useFilters } from '../../..'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'

type EServiceListQueryFilters = {
  q?: string
  version?: string
  consumerId?: string
  state?: string
  createdAt?: string
}

const _FiltersExample: React.FC = () => {
  const [_autocompleteConsumerIdTextInput, setAutocompleteConsumerIdTextInput] =
    useAutocompleteTextInput('')
  const [_autocompleteStateTextInput, setAutocompleteStateTextInput] = useAutocompleteTextInput('')
  const [debug, setDebug] = React.useState(false)

  const location = useLocation()

  const { filtersParams, ...handlers } = useFilters<EServiceListQueryFilters>([
    { name: 'q', type: 'freetext', label: 'Nome' },
    {
      name: 'version',
      type: 'numeric',
      label: 'Cerca per versione',
      min: 10,
      max: 20,
    },
    {
      name: 'consumerId',
      type: 'autocomplete-multiple',
      label: 'Cerca per consumatore',
      options: [
        { value: 'option-1', label: 'PagoPA S.p.A.' },
        { value: 'option-2', label: 'Agenzia delle Entrate' },
      ],
      onTextInputChange: setAutocompleteConsumerIdTextInput,
    },
    {
      name: 'state',
      type: 'autocomplete-single',
      label: 'Stato',
      options: [
        { value: 'pagoPA', label: 'PagoPA S.p.A.' },
        { value: 'agenziaEntrate', label: 'Agenzia delle Entrate' },
      ],
      onTextInputChange: setAutocompleteStateTextInput,
    },
    {
      name: 'createdAt',
      type: 'datepicker',
      label: 'Data di creazione',
      minDate: new Date(),
      // Today plus 1 year
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  ])

  const urlSearchParams = new URLSearchParams(location.search)

  for (const key of urlSearchParams.keys()) {
    urlSearchParams.delete('id')
    if (!handlers.fields.map((field) => field.name).includes(key)) {
      urlSearchParams.delete(key)
    }
  }
  const urlSearchParamsString = '?' + urlSearchParams.toString()

  return (
    <>
      <Filters {...handlers} hasSubmitButton />
      <Container sx={{ bgcolor: debug ? 'white' : 'initial', mt: 4, py: 4 }}>
        <Button variant="naked" onClick={() => setDebug(!debug)}>
          {debug ? 'Hide' : 'Show'} debug values
        </Button>
        {debug && (
          <Stack mt={2} spacing={2}>
            <Box>
              <Typography variant="subtitle1">URL search param</Typography>
              <CodeBlock code={urlSearchParamsString} />
            </Box>
            <Box>
              <Typography variant="subtitle1">filtersParams</Typography>
              <CodeBlock code={filtersParams} />
            </Box>
            <Box>
              <Typography variant="subtitle1">activeFilters</Typography>
              <CodeBlock code={handlers.activeFilters} />
            </Box>
          </Stack>
        )}
      </Container>
    </>
  )
}

const router = createBrowserRouter([{ path: '*', element: <_FiltersExample /> }])
export const FiltersExample: React.FC = () => {
  return <RouterProvider router={router} />
}
