import type { QueueStatus } from '../types/queue'

interface Props {
  status: QueueStatus
}

const config: Record<QueueStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  waiting: {
    label: 'Aguardando atendimento',
    dot: 'bg-on-surface-variant',
    text: 'text-on-surface-variant',
    bg: 'bg-surface-container-high',
    border: 'border-outline-variant/10',
  },
  called: {
    label: 'Sua vez! Dirija-se ao balcão.',
    dot: 'bg-primary shadow-neon-primary-sm pulse-dot',
    text: 'text-primary',
    bg: 'bg-surface-container-high',
    border: 'border-primary/30',
  },
  attended: {
    label: 'Atendido. Obrigado!',
    dot: 'bg-tertiary',
    text: 'text-tertiary',
    bg: 'bg-surface-container-high',
    border: 'border-tertiary/20',
  },
}

export function StatusBadge({ status }: Props) {
  const c = config[status]
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border ${c.bg} ${c.border}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
      <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${c.text}`}>
        {c.label}
      </span>
    </div>
  )
}
