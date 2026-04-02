import { getWaitingSince } from '../utils/localStorage'
import type { QueueEntryWithPosition } from '../types/queue'

interface WaitingCardProps {
  entry: QueueEntryWithPosition
}

// Card used in the admin "Aguardando" column
export function WaitingCard({ entry }: WaitingCardProps) {
  const isFirst = entry.position === 1
  return (
    <div
      className={`rounded-2xl p-5 border transition-colors ${
        isFirst
          ? 'bg-surface-container-highest border-primary/20 shadow-neon-primary'
          : 'bg-surface-container-high border-outline-variant/5 hover:bg-surface-container-highest'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-headline font-bold text-sm border ${
            isFirst
              ? 'bg-surface-container-lowest text-primary border-primary/20'
              : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/10'
          }`}
        >
          {entry.position}º
        </span>
        <div className="text-right">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
            Espera
          </p>
          <p className={`text-sm font-headline font-bold ${isFirst ? 'text-tertiary' : 'text-on-surface'}`}>
            {getWaitingSince(entry.joinedAt)}
          </p>
        </div>
      </div>
      <h3 className="font-headline font-bold text-on-surface text-lg mb-1">{entry.name}</h3>
      <div className="flex items-center gap-1.5 text-on-surface-variant">
        <span className="material-symbols-outlined text-sm">group</span>
        <span className="text-xs font-medium">{entry.partySize} pessoa{entry.partySize !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

interface CalledCardProps {
  entry: QueueEntryWithPosition
  onMarkAttended: (id: string) => void
}

// Card used in the admin "Chamados" column
export function CalledCard({ entry, onMarkAttended }: CalledCardProps) {
  return (
    <div className="bg-surface-container-highest rounded-2xl p-5 border border-primary/20 shadow-[0_4px_20px_rgba(255,159,77,0.1)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary">
          <span
            className="material-symbols-outlined animate-pulse text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            radio_button_checked
          </span>
          <span className="text-[10px] font-label uppercase tracking-widest font-bold">
            Chamado
          </span>
        </div>
        <span className="text-[10px] font-label text-on-surface-variant uppercase">
          {getWaitingSince(entry.joinedAt)} atrás
        </span>
      </div>
      <h3 className="font-headline font-bold text-on-surface text-xl mb-1">{entry.name}</h3>
      <p className="text-xs text-on-surface-variant mb-5 uppercase tracking-widest font-medium">
        Grupo de {String(entry.partySize).padStart(2, '0')} pessoa{entry.partySize !== 1 ? 's' : ''}
      </p>
      <button
        onClick={() => onMarkAttended(entry.id)}
        className="w-full bg-secondary-container text-on-secondary-container py-3 rounded-xl font-headline font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary transition-all"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        Confirmar Atendimento
      </button>
    </div>
  )
}
