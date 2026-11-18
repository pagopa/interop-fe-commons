import React from 'react'
import { CodeBlock } from '../CodeBlock'
import renderer from 'react-test-renderer'

const testCode = {
  test: 'test',
}

describe.skip('CodeBlock component', () => {
  it('Renders correctly', () => {
    const tree = renderer.create(<CodeBlock code={testCode} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Render correctly without copy to clipboard button', () => {
    const tree = renderer.create(<CodeBlock code={testCode} hideCopyButton />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
