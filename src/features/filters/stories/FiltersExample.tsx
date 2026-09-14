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
    { name: 'q', type: 'freetext', label: 'Find by name' },
    {
      name: 'version',
      type: 'numeric',
      label: 'Find by version number',
      min: 10,
      max: 20,
    },
    {
      name: 'consumerId',
      type: 'autocomplete-multiple',
      label: 'Find by consumer',
      options: [
        { value: 'option-1', label: 'PagoPA S.p.A.' },
        { value: 'option-2', label: 'Agenzia delle Entrate' },
        { value: 'option-3', label: 'INPS' },
        { value: 'option-4', label: 'INAIL' },
        { value: 'option-5', label: "Ministero dell'Economia e delle Finanze" },
        { value: 'option-6', label: "Ministero dell'Interno" },
        { value: 'option-7', label: 'Ministero della Salute' },
        { value: 'option-8', label: "Ministero dell'Istruzione e del Merito" },
        { value: 'option-9', label: "Ministero dell'Università e della Ricerca" },
        { value: 'option-10', label: 'Ministero della Giustizia' },
        { value: 'option-11', label: 'Ministero della Difesa' },
        {
          value: 'option-12',
          label: 'Ministero degli Affari Esteri e della Cooperazione Internazionale',
        },
        { value: 'option-13', label: 'Ministero della Cultura' },
        { value: 'option-14', label: 'Ministero del Turismo' },
        { value: 'option-15', label: 'Ministero delle Infrastrutture e dei Trasporti' },
        { value: 'option-16', label: "Ministero dell'Ambiente e della Sicurezza Energetica" },
        { value: 'option-17', label: 'Ministero delle Imprese e del Made in Italy' },
        { value: 'option-18', label: 'Ministero del Lavoro e delle Politiche Sociali' },
        {
          value: 'option-19',
          label: "Ministero dell'Agricoltura, della Sovranità Alimentare e delle Foreste",
        },
        { value: 'option-20', label: 'Agenzia delle Dogane e dei Monopoli' },
        { value: 'option-21', label: 'Agenzia del Demanio' },
        { value: 'option-22', label: "Agenzia per l'Italia Digitale (AgID)" },
        { value: 'option-23', label: 'Agenzia per la Cybersicurezza Nazionale (ACN)' },
        { value: 'option-24', label: 'ISTAT' },
        { value: 'option-25', label: "Banca d'Italia" },
        { value: 'option-26', label: 'CONSOB' },
        { value: 'option-27', label: 'Autorità Garante della Concorrenza e del Mercato (AGCM)' },
        { value: 'option-28', label: 'Autorità per le Garanzie nelle Comunicazioni (AGCOM)' },
        { value: 'option-29', label: 'ARERA' },
        { value: 'option-30', label: 'Garante per la Protezione dei Dati Personali' },
        { value: 'option-31', label: 'Consiglio Nazionale delle Ricerche (CNR)' },
        { value: 'option-32', label: 'ENEA' },
        { value: 'option-33', label: 'Agenzia Spaziale Italiana (ASI)' },
        { value: 'option-34', label: 'Autorità Nazionale Anticorruzione (ANAC)' },
        { value: 'option-35', label: 'Corte dei Conti' },
        { value: 'option-36', label: 'Consiglio di Stato' },
        { value: 'option-37', label: 'Presidenza del Consiglio dei Ministri' },
        { value: 'option-38', label: 'Corpo Nazionale dei Vigili del Fuoco' },
        { value: 'option-39', label: 'Polizia di Stato' },
        { value: 'option-40', label: 'Arma dei Carabinieri' },
        { value: 'option-41', label: 'Guardia di Finanza' },
        { value: 'option-42', label: "Automobile Club d'Italia (ACI)" },
        { value: 'option-43', label: 'Cassa Depositi e Prestiti (CDP)' },
        { value: 'option-44', label: 'Gestore Servizi Energetici (GSE)' },
        { value: 'option-45', label: 'Sogei S.p.A.' },
        { value: 'option-46', label: 'Istituto Poligrafico e Zecca dello Stato (IPZS)' },
        { value: 'option-47', label: 'Croce Rossa Italiana' },
        { value: 'option-48', label: 'Dipartimento della Protezione Civile' },
        { value: 'option-49', label: "Ente Nazionale per l'Aviazione Civile (ENAC)" },
        { value: 'option-50', label: 'ENAV S.p.A.' },
      ],
      onTextInputChange: setAutocompleteConsumerIdTextInput,
    },
    {
      name: 'state',
      type: 'autocomplete-single',
      label: 'Find by State',
      options: [
        { value: 'option-1', label: 'PagoPA S.p.A.' },
        { value: 'option-2', label: 'Agenzia delle Entrate' },
      ],
      onTextInputChange: setAutocompleteStateTextInput,
    },
    {
      name: 'createdAt',
      type: 'datepicker',
      label: 'Find by creation date',
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
      <Filters {...handlers} />
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
