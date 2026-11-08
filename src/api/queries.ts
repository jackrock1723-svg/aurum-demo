export type ReservationInput = {
  readonly name: string
  readonly phone: string
  readonly date: string
  readonly time: string
  readonly guests: string
  readonly occasion: string
  readonly notes: string
}

export type ReservationResult =
  | { kind: 'endpoint_missing' }
  | { kind: 'ok'; id: string; inquiryAt: string }
  | { kind: 'error'; message: string }

const defaultEndpoint =
  import.meta.env.VITE_RESERVATION_ENDPOINT ??
  (typeof window !== 'undefined' ? window.__AURUM_RESERVATION_ENDPOINT : undefined) ??
  ''

export async function submitReservation(
  input: ReservationInput,
  endpoint: string = defaultEndpoint,
): Promise<ReservationResult> {
  if (!endpoint) {
    return { kind: 'endpoint_missing' }
  }

  const query = /* GraphQL */ `
    mutation SubmitReservation($input: ReservationInput!) {
      submitReservation(input: $input) {
        id
        inquiryAt
      }
    }
  `

  const timeoutSignal = AbortSignal.timeout(30_000)
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { input } }),
      signal: timeoutSignal,
    })

    let payload: {
      data?: { submitReservation?: { id: string; inquiryAt: string } }
      errors?: readonly { message: string }[]
    } | null
    try {
      payload = (await response.json()) as typeof payload
    } catch {
      return { kind: 'error', message: 'The reservation service returned an unexpected response.' }
    }

    if (!response.ok || payload?.errors?.length) {
      return {
        kind: 'error',
        message:
          payload?.errors?.[0]?.message ??
          `The reservation request was not accepted (${response.status}).`,
      }
    }

    const record = payload?.data?.submitReservation
    if (!record) {
      return { kind: 'error', message: 'The reservation was not recorded. Please try again.' }
    }

    return { kind: 'ok', id: record.id, inquiryAt: record.inquiryAt }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'The reservation service did not respond.'
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return {
        kind: 'error',
        message: 'The reservation service took too long to reply. Please try again in a moment.',
      }
    }
    return { kind: 'error', message }
  }
}
