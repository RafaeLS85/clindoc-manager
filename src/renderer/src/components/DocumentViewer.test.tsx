// src/renderer/src/components/DocumentViewer.test.tsx
import { render } from '@testing-library/react'
import DocumentViewer from './DocumentViewer'
import { describe, expect, it, vi } from 'vitest'

// Mockeamos la API de electron
vi.mock('../../../electron/api', () => ({
  openFileDialog: vi.fn().mockResolvedValue('test.txt'),
  readTextFile: vi.fn().mockResolvedValue('Initial content'),
  saveTextFile: vi.fn().mockResolvedValue(null)
}))

describe('DocumentViewer', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(<DocumentViewer filePath={''} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
