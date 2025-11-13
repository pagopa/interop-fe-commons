import React from 'react'
import { Pagination, usePagination } from '../..'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import { CodeBlock } from '@/components'

export const _PaginationExample: React.FC = () => {
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination()
  const [debug, setDebug] = React.useState(false)
  const location = useLocation()

  const totalPages = getTotalPageCount(100)

  const urlSearchParams = new URLSearchParams(location.search)
  // Remove all params except offset
  urlSearchParams.delete('id')
  for (const key of urlSearchParams.keys()) {
    if (key !== 'offset') {
      urlSearchParams.delete(key)
    }
  }

  return (
    <>
      <Container sx={{ mt: 4, p: 2 }}>
        <Pagination totalPages={totalPages} {...paginationProps} />
      </Container>
      <Container sx={{ bgcolor: debug ? 'white' : 'initial', mt: 4, py: 4 }}>
        <Button variant="naked" onClick={() => setDebug(!debug)}>
          {debug ? 'Hide' : 'Show'} debug values
        </Button>
        {debug && (
          <Stack mt={2} spacing={2}>
            <Box>
              <Typography variant="subtitle1">URL search param</Typography>
              <CodeBlock code={'?' + urlSearchParams.toString()} />
            </Box>
            <Box>
              <Typography variant="subtitle1">paginationParams</Typography>
              <CodeBlock code={paginationParams} />
            </Box>
          </Stack>
        )}
      </Container>
    </>
  )
}

const router = createBrowserRouter([{ path: '*', element: <_PaginationExample /> }])

export const PaginationExample: React.FC = () => {
  return <RouterProvider router={router} />
}
