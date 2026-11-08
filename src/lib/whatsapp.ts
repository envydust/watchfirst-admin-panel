import type { Plan } from '../api/types'
import { planLabel } from './format'

export function accessCodeMessage(name: string, plan: Plan, code: string) {
  return [
    `Olá, ${name.split(' ')[0]}! Seu acesso WATCHFIRST ${planLabel(plan)} está liberado.`,
    '',
    `Código de acesso: ${code}`,
    '',
    'Abra o WATCHFIRST, escolha "Entrar com código" e cole o código acima. Guarde-o: ele não é exibido novamente no painel.',
  ].join('\n')
}

export function temporaryPasswordMessage(name: string, email: string, password: string, panelUrl: string) {
  return [
    `Olá, ${name.split(' ')[0]}! Sua conta no painel WATCHFIRST foi criada.`,
    '',
    `Acesse: ${panelUrl}`,
    `E-mail: ${email}`,
    `Senha temporária: ${password}`,
    '',
    'No primeiro acesso o painel pede uma senha nova.',
  ].join('\n')
}
