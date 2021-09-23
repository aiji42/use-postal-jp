import endpoint, { APIResponse } from './endpoint'

export const sanitize = (code: string | number): [string, string] => {
  const sanitized = `${code}`
    .replace(/[^0-9０-９]/g, '')
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))

  return [sanitized.slice(0, 3), sanitized.slice(3, 7)]
}

type PostalHandler = {
  makeRequestURL: (postalCode: [string, string]) => string
  parseResponse: (res: APIResponse) => Record<string, unknown>
}

export const postalHandler: PostalHandler = {
  makeRequestURL: ([first, second]) => `${endpoint.api}${first}/${second}.json`,
  parseResponse: (res) => {
    const {
      data: [{ prefcode, ja: data }]
    } = res
    return {
      prefectureCode: prefcode,
      prefecture: data.prefecture,
      address1: data.address1,
      address2: data.address2,
      address3: data.address3,
      address4: data.address4
    }
  }
}

export type ParseResponse<T, R> = (res: R) => T

export const parseResponse: ParseResponse<Address, APIResponse> = (res) => {
  const {
    data: [{ prefcode, ja: data }]
  } = res
  return {
    prefectureCode: prefcode,
    prefecture: data.prefecture,
    address1: data.address1,
    address2: data.address2,
    address3: data.address3,
    address4: data.address4
  }
}

export type Address = {
  prefectureCode: string
  prefecture: string
  address1: string
  address2: string
  address3: string
  address4: string
}
