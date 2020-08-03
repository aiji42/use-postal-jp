import { usePostalJp } from './'
import { renderHook, act } from '@testing-library/react-hooks'

// mock timer using jest
jest.useFakeTimers()

describe('usePostalJp', () => {
  it('updates every second', () => {
    const { result } = renderHook(() => usePostalJp('4560043'))

    console.log(result.current)

    // Fast-forward 1sec
    act(() => {
      jest.advanceTimersByTime(5000)
      if (!result.current.pending && !result.current.error) console.log(result.current)
    })

    console.log(result.current)
  })
})
