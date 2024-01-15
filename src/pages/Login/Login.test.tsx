import * as matchers from '@testing-library/jest-dom/matchers'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import path from 'src/constants/Path'
import { renderWithRouter } from 'src/utils/testutils'
import { beforeEach, describe, expect, it } from 'vitest'

expect.extend(matchers) // ?? what happen

describe('Login', () => {
  const user = userEvent.setup()
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: Element
  beforeEach(async () => {
    await waitFor(() => {
      renderWithRouter({ route: path.login })
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })
    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as Element
  })
  it('Hiển thị lỗi required khi không nhập gì', async () => {
    await user.click(submitButton)
    expect(screen.queryByText(/Bạn chưa nhập email/i)).toBeTruthy()
    expect(screen.queryByText(/Bạn chưa nhập password/i)).toBeTruthy()
    // screen.debug(document.body.parentElement as HTMLElement, 999999)
  })

  it('Hiển thị lỗi input format', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'anvv2'
      }
    })

    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })

    fireEvent.click(submitButton)
    // await user.click(submitButton)
    await waitFor(() => {
      expect(screen.queryByText(/Email chưa đúng định dạng/i)).toBeTruthy()
      expect(screen.queryByText(/Độ dài từ 6 - 160 ký tự/i)).toBeTruthy()
    })
    // screen.debug(document.body.parentElement as HTMLElement, 999999)
  })

  it('Nhập value đúng format sẽ không còn hiện lỗi', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'anvv2@gmail.com'
      }
    })

    fireEvent.change(passwordInput, {
      target: {
        value: 123456
      }
    })

    await waitFor(() => {
      expect(screen.queryByText(/Email chưa đúng định dạngs/i)).toBeFalsy()
      expect(screen.queryByText(/Độ dài từ 6 - 160 ký tự/i)).toBeFalsy()
    })

    fireEvent.submit(submitButton)

    screen.debug(document.body.parentElement as HTMLElement, 999999)
  })
})
