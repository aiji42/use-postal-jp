import { usePostalJp } from './'
import { renderHook, act } from '@testing-library/react-hooks'
import axios from 'axios'

jest.mock('axios')

const mockData = {
  data: {
    code: '1000001',
    data: [
      {
        prefcode: '13',
        ja: {
          prefecture: '東京都',
          address1: '千代田区',
          address2: '千代田',
          address3: '',
          address4: ''
        },
        en: {
          prefecture: 'Tokyo',
          address1: 'Chiyoda-ku',
          address2: 'Chiyoda',
          address3: '',
          address4: ''
        }
      }
    ]
  },
  status: 200,
  statusText: 'OK'
}

describe('usePostalJp', () => {
  afterEach(() => jest.restoreAllMocks())

  it('translates correctly', async () => {
    (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockData))
    const { result } = renderHook(() => usePostalJp())

    await act(async () => {
      result.current.setPostalCode('1000001')
    })

    expect(result.current.address.prefectureCode).toBe('13')
    expect(result.current.address.prefecture).toBe('東京都')
    expect(result.current.address.address1).toBe('千代田区')
    expect(result.current.address.address2).toBe('千代田')
    expect(result.current.address.address3).toBe('')
    expect(result.current.pending).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('is rightly sanitized', async () => {
    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(mockData))
    const { result } = renderHook(() => usePostalJp())

    await act(async () => {
      result.current.setPostalCode('1000001')
    })
    expect(result.current.sanitizedCode).toBe('1000001')

    await act(async () => {
      result.current.setPostalCode('100-0001')
    })
    expect(result.current.sanitizedCode).toBe('1000001')

    await act(async () => {
      result.current.setPostalCode('１０００００１')
    })
    expect(result.current.sanitizedCode).toBe('1000001')

    await act(async () => {
      result.current.setPostalCode('10000010')
    })
    expect(result.current.sanitizedCode).toBe('1000001')
  })

  it('is able to hundle errors', async () => {
    (axios.get as jest.Mock).mockImplementation(() => Promise.reject(new Error('File not found')))
    const { result } = renderHook(() => usePostalJp())

    expect(result.current.error).toBe(null)

    await act(async () => {
      result.current.setPostalCode('100000')
    })
    expect(result.current.error?.message).toBe('Incorrect postcode.')

    await act(async () => {
      result.current.setPostalCode('1000001')
    })
    expect(result.current.error?.message).toBe('File not found')
  })
})
