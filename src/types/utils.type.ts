export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export type NoUndefinedType<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined>
}
