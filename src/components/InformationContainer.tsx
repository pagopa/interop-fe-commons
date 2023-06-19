import React from 'react'
import { Box, Typography, Stack, Divider, Skeleton } from '@mui/material'
import type { StackProps } from '@mui/material'
import { CopyToClipboardButton } from '@pagopa/mui-italia'
import type { CopyToClipboardProps } from '@pagopa/mui-italia'

export interface InformationContainerProps extends Omit<StackProps, 'children' | 'content'> {
  label: string
  labelDescription?: string
  content: JSX.Element | string
  copyToClipboard?: CopyToClipboardProps
}

/**
 * Renders a label and a content in a row or a column.
 *
 * If the content is a string, it will be wrapped in a <p> tag.
 * If the content is a JSX.Element, it will be wrapped in a <div> tag.
 *
 * If the copyToClipboard prop is passed, a copy to clipboard button will be rendered.
 * The copyToClipboard prop will be passed to the CopyToClipboardButton `@pagopa/mui-italia's` component.
 */
export function InformationContainer({
  label,
  labelDescription,
  copyToClipboard,
  direction = 'row',
  content,
  ...props
}: InformationContainerProps) {
  return (
    <Stack
      spacing={direction === 'column' ? 0 : 4}
      direction={direction}
      alignItems={direction === 'column' ? 'flex-start' : 'center'}
      {...props}
    >
      <Box sx={{ flexShrink: 0, maxWidth: direction === 'column' ? 'none' : '200px', flex: 1 }}>
        <Typography variant="body2">{label}</Typography>
        {labelDescription && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Typography color="text.secondary" sx={{ display: 'inline-block' }} variant="caption">
              {labelDescription}
            </Typography>
          </>
        )}
      </Box>
      <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
        <Typography
          component={typeof content === 'string' ? 'p' : 'div'}
          variant="body2"
          fontWeight={600}
        >
          {content}
        </Typography>
        {copyToClipboard && (
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <CopyToClipboardButton {...copyToClipboard} />
          </Box>
        )}
      </Stack>
    </Stack>
  )
}

/**
 * Renders a skeleton for the InformationContainer component.
 */
export const InformationContainerSkeleton: React.FC = () => {
  return (
    <Stack spacing={4} direction="row">
      <Box sx={{ flexShrink: 0, maxWidth: '200px', flex: 1 }}>
        <Skeleton />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Skeleton />
        <Skeleton />
      </Box>
    </Stack>
  )
}
