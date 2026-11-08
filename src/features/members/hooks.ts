import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { members as membersApi } from '../../api/endpoints'
import type { MemberInput } from '../../api/types'
import { keys } from '../../app/queryClient'
import { useCan } from '../../auth/permissions'

export function useSnapshot() {
  const can = useCan()
  return useQuery({
    queryKey: keys.snapshot,
    queryFn: membersApi.snapshot,
    enabled: can('members.read'),
    refetchInterval: 60_000,
  })
}

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.')

export function useMemberMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: keys.snapshot })
  const onError = (e: unknown) => toast.error(errorMessage(e))

  const create = useMutation({
    mutationFn: (input: MemberInput) => membersApi.create(input),
    onSuccess: invalidate,
    onError,
  })
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: MemberInput }) => membersApi.update(id, input),
    onSuccess: () => {
      invalidate()
      toast.success('Membro atualizado.')
    },
    onError,
  })
  const remove = useMutation({
    mutationFn: (id: string) => membersApi.remove(id),
    onSuccess: () => {
      invalidate()
      toast.success('Membro excluído.')
    },
    onError,
  })
  const rotate = useMutation({
    mutationFn: (id: string) => membersApi.rotate(id),
    onSuccess: invalidate,
    onError,
  })
  const disconnect = useMutation({
    mutationFn: (id: string) => membersApi.disconnect(id),
    onSuccess: () => {
      invalidate()
      toast.success('Dispositivos desconectados.')
    },
    onError,
  })
  return { create, update, remove, rotate, disconnect }
}
