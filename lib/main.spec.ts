import { usePostalJp } from './main'
import { renderHook } from '@testing-library/react-hooks'
import fetchMock from 'fetch-mock'

fetchMock
  .get('https://madefor.github.io/postal-code-api/api/v1/100/0001.json', {
    body: {
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
    }
  })
  .get('https://madefor.github.io/postal-code-api/api/v1/999/9999.json', 404)
  .get('https://example.com/api/postal_codes?postal_code=100-0001', {
    body: [
      {
        postal_code: '100-0001',
        prefecture_code: '13',
        prefecture_name: '東京都',
        prefecture_name_kana: 'トウキョウト',
        city_code: '13101',
        city_name: '千代田区',
        city_name_kana: 'チヨダク',
        town_name: '千代田',
        town_name_kana: 'チヨダ'
      }
    ]
  })

describe('usePostalJp', () => {
  test('郵便番号が存在していれば住所が返却される', async () => {
    const { result, waitFor } = renderHook(() => usePostalJp('1000001', true))

    expect(result.current[1]).toEqual(true)

    await waitFor(() => !result.current[1])
    expect(result.current[0]).toEqual({
      address1: '千代田区',
      address2: '千代田',
      address3: '',
      address4: '',
      prefecture: '東京都',
      prefectureCode: '13'
    })
    expect(result.current[1]).toEqual(false)
    expect(result.current[2]).toBeNull()
  })

  test('郵便番号が存在しなければエラーが返却される', async () => {
    const { result, waitFor } = renderHook(() => usePostalJp('9999999', true))

    expect(result.current[1]).toEqual(true)

    await waitFor(() => !result.current[1])
    expect(result.current[0]).toEqual(null)
    expect(result.current[1]).toEqual(false)
    expect(result.current[2]).toBeInstanceOf(Error)
  })

  test('全角数字やハイフンが含まれていても問題ない', async () => {
    const { result, waitFor } = renderHook(() =>
      usePostalJp('１００ー０００１', true)
    )

    expect(result.current[1]).toEqual(true)

    await waitFor(() => !result.current[1])
    expect(result.current[0]).toEqual({
      address1: '千代田区',
      address2: '千代田',
      address3: '',
      address4: '',
      prefecture: '東京都',
      prefectureCode: '13'
    })
    expect(result.current[1]).toEqual(false)
    expect(result.current[2]).toBeNull()
  })

  test('第2引数がfalseであるときは通信しない', () => {
    const { result } = renderHook(() => usePostalJp('1000001', false))

    expect(result.current[0]).toBeNull()
    expect(result.current[1]).toEqual(false)
    expect(result.current[2]).toBeNull()
  })

  test('カスタムエンドポイントとカスタムレスポンスパース', async () => {
    const { result, waitFor } = renderHook(() =>
      usePostalJp('1000001', true, {
        url: ([first, second]) =>
          `https://example.com/api/postal_codes?postal_code=${first}-${second}`,
        parse: (
          res: {
            prefecture_name: string
            city_name: string
            town_name: string
          }[]
        ) => ({
          prefecture: res[0].prefecture_name,
          city: res[0].city_name,
          town: res[0].town_name
        })
      })
    )

    await waitFor(() => !result.current[1])
    expect(result.current[0]).toEqual({
      prefecture: '東京都',
      city: '千代田区',
      town: '千代田'
    })
    expect(result.current[2]).toBeNull()
  })
})
