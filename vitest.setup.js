import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http } from 'msw'
import config from './src/constants/config'
import HttpStatusCode from './src/constants/HttpStatusCode.enum'

const loginResponse = {
  message: "Đăng nhập thành công",
  data: {
    access_token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODMwODNiYjExNDAwODkzZGY3MTlmYSIsImVtYWlsIjoiYW52djJAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNVQwOTo1NzoyMS4xMDhaIiwiaWF0IjoxNzA1MzEyNjQxLCJleHAiOjE3MDUzOTkwNDF9.I95gk2A95PE05MQa0OiWjub5PgmMFnDAeflIyKEhXzA",
    expires: 86400,
    refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODMwODNiYjExNDAwODkzZGY3MTlmYSIsImVtYWlsIjoiYW52djJAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNVQwOTo1NzoyMS4xMDhaIiwiaWF0IjoxNzA1MzEyNjQxLCJleHAiOjE3MTkxMzY2NDF9.DtcebvBdmKjLSRfQRklSzJAPVIDGnDa3_aXLkHvJmow",
    expires_refresh_token: 13824000,
    user: {
      _id: "6583083bb11400893df719fa",
      roles: [
        "User"
      ],
      email: "anvv2@gmail.com",
      createdAt: "2023-12-20T15:28:59.668Z",
      updatedAt: "2023-12-20T15:29:48.300Z",
      __v: 0,
      avatar: "fa5e12cf-12f8-42b2-a711-3460e29db561.jpg",
      date_of_birth: "1989-12-31T17:00:00.000Z",
      name: "Vũ Vương An"
    }
  }
}

export const restHandlers = [
  http.post(`${config.baseUrl}login`, (req, res, ctx) => {
    return res(ctx.status(HttpStatusCode.Ok), ctx.json(loginResponse))
  })
]



const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
