import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import App from './App'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import * as matchers from '@testing-library/jest-dom/matchers'
import '@testing-library/jest-dom/vitest'
import path from './constants/Path'
import { renderWithRouter } from './utils/testutils'

expect.extend(matchers) // ?? what happen

describe('App', () => {
  test('App render và chuyển trang', async () => {
    renderWithRouter()
    const user = userEvent.setup()

    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang Chủ | Shopee') // Tại sao không vượt qua test???
    })

    await user.click(screen.getByText(/Đăng nhập/i))
    await waitFor(() => {
      expect(screen.queryByText('Bạn chưa có tải khoản?')).toBeInTheDocument()
    })

    // screen.debug(document.body.parentElement as HTMLElement)
  })

  test('về trang not found', async () => {
    const badRoute = '/some/bad/route'
    renderWithRouter({ route: badRoute })

    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    })
    // screen.debug(document.body.parentElement as HTMLElement, 999999)
  })

  test('Render trang Register', async () => {
    renderWithRouter({ route: path.register })

    await waitFor(() => {
      expect(screen.getByText(/Bạn đã có tải khoản?/i)).toBeInTheDocument()
    })
    screen.debug(document.body.parentElement as HTMLElement, 999999)
  })
})
