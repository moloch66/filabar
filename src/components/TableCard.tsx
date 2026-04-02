import type { Table } from '../types/tables'

interface TableCardProps {
  table: Table
  /** True when a client is selected and this free table is a valid assignment target */
  isTarget: boolean
  /** Whether the panel is in assign mode (dims non-free tables) */
  assignMode: boolean
  onClick: (id: string) => void
}

const STATUS_CONFIG = {
  free: {
    bg: 'bg-surface-container-high hover:bg-surface-container-highest',
    iconColor: 'text-on-surface-variant/40',
    numberColor: 'text-on-surface-variant',
    badgeBg: 'bg-success-container',
    badgeText: 'text-success',
    badgeLabel: 'Livre',
    shadow: undefined as string | undefined,
  },
  occupied: {
    bg: 'bg-[#1A0E0E] hover:bg-[#1F1010]',
    iconColor: 'text-error/50',
    numberColor: 'text-error',
    badgeBg: 'bg-[#2A1111]',
    badgeText: 'text-error',
    badgeLabel: 'Ocupada',
    shadow: '0 0 20px rgba(255, 113, 81, 0.18)' as string | undefined,
  },
  reserved: {
    bg: 'bg-[#1A1300] hover:bg-[#1F1700]',
    iconColor: 'text-primary/60',
    numberColor: 'text-primary',
    badgeBg: 'bg-[#2A1E00]',
    badgeText: 'text-primary',
    badgeLabel: 'Reservada',
    shadow: '0 0 20px rgba(255, 138, 0, 0.18)' as string | undefined,
  },
}

const STATUS_CYCLE: Record<string, 'free' | 'reserved' | 'occupied'> = {
  free: 'reserved',
  reserved: 'occupied',
  occupied: 'free',
}

export { STATUS_CYCLE }

export default function TableCard({ table, isTarget, assignMode, onClick }: TableCardProps) {
  const cfg = STATUS_CONFIG[table.status]
  const prefix = table.area === 'internal' ? 'M' : 'E'

  // In assign mode, only free tables that are targets are clickable
  const disabled = assignMode && !isTarget

  return (
    <button
      onClick={() => onClick(table.id)}
      disabled={disabled}
      title={
        assignMode
          ? isTarget
            ? 'Associar cliente a esta mesa'
            : `Mesa ${prefix}${table.number} — ${cfg.badgeLabel}`
          : `${cfg.badgeLabel} — clique para alterar status`
      }
      className={`
        relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 p-4 w-full
        transition-all duration-200
        ${isTarget
          ? 'bg-[#1F1700] ring-2 ring-primary/60 scale-[1.03]'
          : cfg.bg
        }
        ${disabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
      `}
      style={{
        boxShadow: isTarget
          ? '0 0 32px rgba(255, 138, 0, 0.35)'
          : cfg.shadow,
      }}
    >
      {/* Table icon */}
      <span
        className={`material-symbols-outlined text-3xl transition-colors ${
          isTarget ? 'text-primary' : cfg.iconColor
        }`}
        style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
      >
        table_restaurant
      </span>

      {/* Table number */}
      <span className={`font-brand font-bold text-base leading-none transition-colors ${
        isTarget ? 'text-primary' : cfg.numberColor
      }`}>
        {prefix}{table.number}
      </span>

      {/* Status badge */}
      <span className={`text-[10px] font-label uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
        isTarget
          ? 'bg-primary/20 text-primary'
          : `${cfg.badgeBg} ${cfg.badgeText}`
      }`}>
        {isTarget ? 'Associar' : cfg.badgeLabel}
      </span>
    </button>
  )
}
