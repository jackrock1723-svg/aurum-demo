import { describe, expect, it, vi } from 'vitest'
import { submitReservation, type ReservationInput } from '../queries'

const testInput: ReservationInput = {
  name: 'Ada Lively',
  phone: '+442079460300',
  date: '2026-12-18',
  time: '19:00',
  guests: '2',
  occasion: 'Birthday',
  notes: '',
}

describe('submitReservation', () => {
  it('returns endpoint_missing when VITE_RESERVATION_ENDPOINT is empty', async () => {
    const result = await submitReservation(testInput)
    expect(result).toEqual({ kind: 'endpoint_missing' })
  })

  it('returns ok with id and inquiryAt when the endpoint replies successfully', async () => {
    const endpoint = 'https://example.invalid/graphql'
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: { submitReservation: { id: 'REQ-0001', inquiryAt: '2026-11-07T12:00:00Z' } },
        }),
        { status: 200 },
      ),
    )
    const result = await submitReservation(testInput, endpoint)
    expect(result).toEqual({ kind: 'ok', id: 'REQ-0001', inquiryAt: '2026-11-07T12:00:00Z' })
    expect(fetchSpy).toHaveBeenCalledWith(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('submitReservation'),
      signal: expect.any(AbortSignal),
    })
    expect(result).toEqual({ kind: 'ok', id: 'REQ-0001', inquiryAt: '2026-11-07T12:00:00Z' })
  })

  it('returns an error message when the endpoint responds with an error status', async () => {
    const endpoint = 'https://example.invalid/graphql'
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ errors: [{ message: 'Capacity exceeded for that evening.' }] }),
        { status: 422 },
      ),
    )
    const result = await submitReservation(testInput, endpoint)
    expect(result).toEqual({ kind: 'error', message: 'Capacity exceeded for that evening.' })
  })

  it('returns an error message on network failure', async () => {
    const endpoint = 'https://example.invalid/graphql'
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'))
    const result = await submitReservation(testInput, endpoint)
    expect(result).toEqual({ kind: 'error', message: 'Failed to fetch' })
  })

  it('returns an error message when the endpoint times out', async () => {
    const endpoint = 'https://example.invalid/graphql'
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new DOMException('The operation was aborted.', 'TimeoutError'))
    const result = await submitReservation(testInput, endpoint)
    expect(result.kind).toBe('error')
    expect((result as { kind: 'error'; message: string }).message).toContain('took too long')
    expect(fetchSpy).toHaveBeenCalled()
  })
})
