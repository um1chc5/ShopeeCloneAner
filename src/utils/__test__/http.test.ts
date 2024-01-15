import { beforeEach, describe, expect, it } from 'vitest'
import { Http } from '../http'
import HttpStatusCode from 'src/constants/HttpStatusCode.enum'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../auth'

describe('http-axios', () => {
  let localHttp = new Http().instance

  beforeEach(() => {
    localStorage.clear()
    localHttp = new Http().instance
  })

  const access_token_1s =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODMwODNiYjExNDAwODkzZGY3MTlmYSIsImVtYWlsIjoiYW52djJAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0wOFQxODoxNjo0OS4yMDdaIiwiaWF0IjoxNzA0NzM3ODA5LCJleHAiOjE3MDQ3Mzc4MTB9.Ky8TGGBzRW-r_RWCfDMVDS6M48df_VR3KKmMOOYh9aE'

  const refresh_token_1000days =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODMwODNiYjExNDAwODkzZGY3MTlmYSIsImVtYWlsIjoiYW52djJAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0wOFQxODoxNjo0OS4yMDdaIiwiaWF0IjoxNzA0NzM3ODA5LCJleHAiOjE3OTExMzc4MDl9.CZxZgvRtRuOCbn26n785A8MLbq8ljbqg6Toc1mt2raY'

  it('Get API', async () => {
    const res = await localHttp.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Auth Request', async () => {
    await localHttp.post('login', {
      email: 'anvv2@gmail.com',
      password: '123456'
    })
    const res = await localHttp.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Refresh token', async () => {
    setAccessTokenToLS(access_token_1s)
    setRefreshTokenToLS(refresh_token_1000days)
    const httpNew = new Http().instance // tạo lại instance cho Http để vì dữ liệu về refresh token mới được gán lại
    const res = await httpNew.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
