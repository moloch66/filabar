import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { addToQueue, getCurrentId, getQueue } from '../utils/localStorage'

export default function JoinQueue() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [errors, setErrors] = useState<{ name?: string }>({})

  // If already in queue, redirect to /fila
  useEffect(() => {
    const id = getCurrentId()
    if (!id) return
    const queue = getQueue()
    const entry = queue.find((e) => e.id === id)
    if (entry && entry.status !== 'attended') {
      navigate('/fila', { replace: true })
    }
  }, [navigate])

  function validate() {
    if (name.trim().length < 2) {
      setErrors({ name: 'Nome deve ter pelo menos 2 caracteres.' })
      return false
    }
    setErrors({})
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    addToQueue(name.trim(), partySize)
    navigate('/fila')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* Brand header */}
      <header className="w-full max-w-[342px] mb-12 text-center relative z-10">
        <div className="inline-flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-primary text-3xl mr-2">local_bar</span>
          <h1 className="text-4xl font-brand font-extrabold italic tracking-tighter text-primary drop-shadow-[0_0_12px_rgba(255,159,77,0.4)] uppercase">
            FILABAR
          </h1>
        </div>
        <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] font-bold">
          Entre na fila pelo seu celular
        </p>
      </header>

      {/* Form card */}
      <main className="w-full max-w-[342px] relative z-10">
        <div className="bg-surface-container-highest rounded-2xl p-8 shadow-card relative overflow-hidden">
          {/* Card inner glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

          <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-primary px-1">
                Nome
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como devemos te chamar?"
                  className="w-full bg-surface-container-low border-0 rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:bg-surface-container-high transition-all"
                />
                <div className="absolute inset-0 rounded-xl border border-primary/10 group-focus-within:border-primary/30 pointer-events-none transition-colors" />
              </div>
              {errors.name && (
                <p className="text-error text-xs px-1">{errors.name}</p>
              )}
            </div>

            {/* Party size counter */}
            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-primary px-1">
                Número de pessoas
              </label>
              <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-2 border border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="text-3xl font-brand font-bold text-on-surface">
                  {String(partySize).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => setPartySize((n) => Math.min(20, n + 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-on-primary shadow-neon-primary-sm active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-br from-primary to-primary-fixed rounded-full text-on-primary-container font-brand font-bold text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(255,159,77,0.2)] active:scale-95 transition-all"
              >
                Entrar na fila
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <footer className="mt-8 text-center">
          <p className="text-[10px] text-on-surface-variant/50 font-medium uppercase tracking-[0.08em]">
            Cada pessoa pode estar em apenas uma fila por vez.
          </p>
        </footer>
      </main>
    </div>
  )
}
