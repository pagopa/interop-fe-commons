import React from 'react'
import { Table as _Table } from '../Table'
import { TableRow } from '../TableRow'
import type { Meta, StoryFn } from '@storybook/react'
import { Button, Chip } from '@mui/material'

export default { title: 'Components/Table', component: _Table } as Meta<typeof _Table>

const tableData = [
  { name: 'e-service 1', state: 'ACTIVE' },
  { name: 'e-service 2', state: 'SUSPENDED' },
  { name: 'e-service 3', state: 'ARCHIVED' },
]

export const WithContent: StoryFn<typeof _Table> = () => {
  const headLabels = ['Nome', 'Stato', '']
  const isEmpty = tableData.length === 0

  return (
    <_Table isEmpty={isEmpty} headLabels={headLabels}>
      {tableData.map((data) => (
        <TableRow
          key={data.name}
          cellData={[data.name, <Chip key={data.name} label={data.state} />]}
        >
          <Button size="small" variant="outlined">
            Ispeziona
          </Button>
        </TableRow>
      ))}
    </_Table>
  )
}

export const Empty: StoryFn<typeof _Table> = () => {
  const headLabels = ['Nome', 'Stato', '']
  return (
    <_Table isEmpty={true} headLabels={headLabels}>
      <></>
    </_Table>
  )
}
