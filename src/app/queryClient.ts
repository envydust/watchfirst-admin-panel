import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../api/client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      refetchOnWindowFocus: true,
      retry: (count, error) => {
        // Auth and permission errors never recover by retrying.
        if (error instanceof ApiError && [400, 401, 403, 404, 409].includes(error.status)) return false
        return count < 2
      },
    },
    mutations: { retry: 0 },
  },
})

export const keys = {
  me: ['me'] as const,
  status: ['auth-status'] as const,
  snapshot: ['snapshot'] as const,
  requests: ['requests'] as const,
  users: ['users'] as const,
  audit: (params: Record<string, unknown>) => ['audit', params] as const,
  payments: ['payments'] as const,
}
