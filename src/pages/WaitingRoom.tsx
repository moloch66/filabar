import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentId, clearCurrentId, getQueue, withPositions } from '../utils/localStorage'
import { useClientEntry } from '../hooks/useQueue'
import { StatusBadge } from '../components/StatusBadge'

export default function WaitingRoom() {
  const navigate = useNavigate()
  const currentId = getCurrentId()
  const { entry } = useClientEntry(currentId)

  // No id at all → back to join
  useEffect(() => {
    if (!currentId) {
      navigate('/', { replace: true })
      return
    }
    // Check entry exists in queue
    const all = withPositions(getQueue())
    if (!all.find((e) => e.id === currentId)) {
      navigate('/', { replace: true })
    }
  }, [currentId, navigate])

  // After attended, clean up and show final state briefly
  useEffect(() => {
    if (entry?.status === 'attended') {
      const t = setTimeout(() => {
        clearCurrentId()
      }, 5000)
      return () => clearTimeout(t)
    }
  }, [entry?.status])

  function handleLeave() {
    if (!currentId) return
    import('../utils/localStorage').then(({ removeFromQueue }) => {
      removeFromQueue(currentId)
      clearCurrentId()
      navigate('/', { replace: true })
    })
  }

  if (!entry) return null

  const totalWaiting = withPositions(getQueue()).filter((e) => e.status === 'waiting').length

  return (
    <div className="relative w-full min-h-dvh bg-surface overflow-hidden flex flex-col">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full" />
      </div>

      {/* Header */}
      <header className="glass-nav sticky top-0 z-50 flex justify-between items-center px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">local_bar</span>
          <h1 className="text-2xl font-brand font-black italic text-primary tracking-tighter drop-shadow-[0_0_10px_rgba(255,159,77,0.4)]">
            FILABAR
          </h1>
        </div>
        {entry.status === 'waiting' && (
          <button
            onClick={handleLeave}
            className="bg-surface-container-highest border border-outline-variant/15 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors active:scale-95"
          >
            Sair da fila
          </button>
        )}
      </header>

      <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto relative z-10 flex flex-col items-center">
        {/* Live status badge */}
        <div className="mb-8">
          <StatusBadge status={entry.status} />
        </div>

        {/* Position hero */}
        {entry.status === 'waiting' && (
          <section className="flex flex-col items-center mb-10">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-[240px] h-[240px] bg-primary/10 blur-[60px] rounded-full" />
              <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-surface-container-highest to-surface-container-low flex flex-col items-center justify-center border border-primary/20 neon-glow">
                <span className="font-label text-[12px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                  Sua posição
                </span>
                <span className="font-headline text-8xl font-black text-primary leading-none tracking-tighter italic">
                  {entry.position}
                </span>
                <span className="font-label text-[12px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-2">
                  na fila
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Called state — full-page alert */}
        {entry.status === 'called' && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <span
              className="material-symbols-outlined text-primary text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,159,77,0.6)] animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              campaign
            </span>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-2">
              É a sua vez,
            </p>
            <p className="text-on-surface font-headline font-black text-3xl">{entry.name}</p>
          </div>
        )}

        {/* Attended state */}
        {entry.status === 'attended' && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <span
              className="material-symbols-outlined text-tertiary text-7xl mb-4"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <p className="text-tertiary font-headline font-black text-2xl mb-2">Bom proveito!</p>
            <p className="text-on-surface-variant font-label text-sm">Obrigado por usar o FilaBar.</p>
          </div>
        )}

        {/* Info pills */}
        {entry.status === 'waiting' && (
          <div className="grid grid-cols-2 gap-3 w-full mb-10">
            <div className="bg-surface-container-highest rounded-xl p-4 flex flex-col items-start gap-1">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">groups</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Pessoas à frente
              </span>
              <span className="text-xl font-bold text-on-surface">
                {Math.max(0, entry.position - 1)}
              </span>
            </div>
            <div className="bg-surface-container-highest rounded-xl p-4 flex flex-col items-start gap-1 border-l-2 border-primary/40">
              <span className="material-symbols-outlined text-primary text-lg">schedule</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Tempo estimado
              </span>
              <span className="text-xl font-bold text-on-surface">
                ~{entry.estimatedWaitMinutes} min
              </span>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {entry.status === 'waiting' && totalWaiting > 0 && (
          <div className="w-full space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                Fluxo da Fila
              </span>
              <span className="text-xs font-bold text-primary">
                {entry.position} de {totalWaiting} na fila
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full shadow-[0_0_10px_rgba(255,159,77,0.5)] transition-all duration-700"
                style={{ width: `${(entry.position / totalWaiting) * 100}%` }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom nav (matches Stitch design) */}
      <nav className="glass-nav fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.8)]">
        <div
          onClick={() => navigate('/')}
          className="flex flex-col items-center text-on-surface-variant/60 cursor-pointer hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">Join</span>
        </div>
        <div className="flex flex-col items-center text-primary bg-surface-container-highest rounded-2xl px-5 py-2 shadow-neon-primary-sm">
          <span className="material-symbols-outlined">hourglass_empty</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">Tracking</span>
        </div>
        <div
          onClick={() => navigate('/admin')}
          className="flex flex-col items-center text-on-surface-variant/60 cursor-pointer hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">explore</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-widest mt-1">Admin</span>
        </div>
      </nav>
    </div>
  )
}
