import { describe, expect, it } from 'vitest'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS,
  clearLS,
  setProfileToLS
} from './../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODMwODNiYjExNDAwODkzZGY3MTlmYSIsImVtYWlsIjoiYW52djJAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0wN1QxOTo0ODowNC41NjFaIiwiaWF0IjoxNzA0NjU2ODg0LCJleHAiOjE3MDQ3NDMyODR9.DV3bWSr18n98jSXrgxRHpLA5FbQHvj6ctsYbgwYwWVM'

const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODMwODNiYjExNDAwODkzZGY3MTlmYSIsImVtYWlsIjoiYW52djJAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0wN1QxOTo0ODowNC41NjFaIiwiaWF0IjoxNzA0NjU2ODg0LCJleHAiOjE3MTg0ODA4ODR9.1hEQ1Chyrj9EuH09boRoXRey2bIKoMI3vivHfJzF35o'

const profile =
  '{"_id":"6583083bb11400893df719fa","roles":["User"],"email":"anvv2@gmail.com","createdAt":"2023-12-20T15:28:59.668Z","updatedAt":"2023-12-20T15:29:48.300Z","__v":0,"avatar":"fa5e12cf-12f8-42b2-a711-3460e29db561.jpg","date_of_birth":"1989-12-31T17:00:00.000Z","name":"Vũ Vương An"}'

describe('Access Token', () => {
  it('access_token được set vào local storage', () => {
    setAccessTokenToLS(access_token)
    expect(getAccessTokenFromLS()).toBe(access_token)
  })
})

describe('Refresh Token', () => {
  it('refresh token được set vào local storage', () => {
    setRefreshTokenToLS(refresh_token)
    expect(getRefreshTokenFromLS()).toEqual(refresh_token)
  })
})

describe('clearLS', () => {
  it('clear local storage', () => {
    setAccessTokenToLS(access_token)
    setRefreshTokenToLS(refresh_token)
    clearLS()
    expect(getAccessTokenFromLS()).toBe('')
    expect(getRefreshTokenFromLS()).toBe('')
  })
})
