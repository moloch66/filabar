import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueue } from '../hooks/useQueue'
import { WaitingCard, CalledCard } from '../components/QueueCard'
import { getWaitingSince } from '../utils/localStorage'

type MobileTab = 'waiting' | 'called' | 'attended'

export default function AdminPanel() {
  const navigate = useNavigate()
  const { waiting, called, attended, callNext, markAttended, clearAll } = useQueue()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('waiting')

  function handleClearAll() {
    if (window.confirm('Limpar toda a fila? Esta ação não pode ser desfeita.')) {
      clearAll()
    }
  }

  return (
    <div className="h-screen overflow-hidden flex bg-background">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40
          w-72 bg-surface-container-low flex flex-col border-r border-outline-variant/10 flex-shrink-0
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-8">
          {/* Logo + close button (mobile) */}
          <div className="flex items-center gap-2 mb-12">
            <button
              onClick={() => navigate('/fila')}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              title="Ver posição na fila"
            >
              <span className="material-symbols-outlined text-primary text-3xl">local_bar</span>
              <span className="font-brand font-black italic text-2xl tracking-tighter text-primary drop-shadow-[0_0_10px_rgba(255,159,77,0.4)]">
                FILABAR
              </span>
            </button>
            <button
              className="ml-auto md:hidden text-on-surface-variant hover:text-on-surface"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="space-y-2">
            <div className="flex items-center gap-4 px-4 py-3 bg-surface-container-highest text-primary rounded-xl shadow-neon-primary cursor-default">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                hourglass_empty
              </span>
              <span className="font-headline text-sm font-bold uppercase tracking-widest">
                Fila ao vivo
              </span>
            </div>
            <div
              className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-xl cursor-pointer"
              onClick={() => navigate('/admin/mesas')}
            >
              <span className="material-symbols-outlined">table_restaurant</span>
              <span className="font-headline text-sm font-bold uppercase tracking-widest">
                Mesas
              </span>
            </div>
            <div className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-xl cursor-pointer">
              <span className="material-symbols-outlined">history</span>
              <span className="font-headline text-sm font-bold uppercase tracking-widest">
                Histórico
              </span>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-outline-variant/5">
          <div className="flex items-center gap-3 bg-surface-container-high p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              FB
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">FilaBar</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Manager</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-on-surface-variant text-sm">
              settings
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top bar ── */}
        <header className="h-16 md:h-20 bg-surface/60 backdrop-blur-[20px] flex items-center justify-between px-4 md:px-10 sticky top-0 z-10 border-b border-outline-variant/5 gap-3">

          {/* Left: hamburger (mobile) + breadcrumb (desktop) */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden text-on-surface-variant hover:text-on-surface flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Logo — mobile only (no sidebar visible) */}
            <button
              onClick={() => navigate('/fila')}
              className="md:hidden font-brand font-black italic text-lg tracking-tighter text-primary hover:opacity-70 transition-opacity"
              title="Ver posição na fila"
            >
              FILABAR
            </button>

            {/* Breadcrumb — desktop only */}
            <nav className="hidden md:flex items-center gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant">
              <span>Painel</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface">Fila ao vivo</span>
            </nav>

            {/* Live indicator */}
            <div className="hidden sm:flex ml-0 md:ml-6 px-3 py-1 bg-primary/10 rounded-full items-center gap-2 flex-shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.1em]">
                {waiting.length} aguardando
              </span>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* "Limpar fila" — hidden on very small screens */}
            <button
              onClick={handleClearAll}
              className="hidden sm:block border border-outline-variant/20 text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-xl font-headline font-bold text-[10px] uppercase tracking-widest transition-colors"
            >
              Limpar fila
            </button>

            {/* "Chamar próximo" — icon only on mobile, full on desktop */}
            <button
              onClick={callNext}
              disabled={waiting.length === 0}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary-container px-3 md:px-6 py-2 md:py-2.5 rounded-full font-headline font-bold text-sm flex items-center gap-2 shadow-neon-primary-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                campaign
              </span>
              <span className="hidden sm:inline">Chamar próximo</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              title="Ir para entrada"
            >
              <span className="material-symbols-outlined">open_in_new</span>
            </button>
          </div>
        </header>

        {/* ── Mobile: tab switcher ── */}
        <div className="md:hidden flex border-b border-outline-variant/10 bg-surface/60 backdrop-blur-sm">
          <button
            onClick={() => setMobileTab('waiting')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest font-headline transition-colors flex flex-col items-center gap-0.5 ${
              mobileTab === 'waiting'
                ? 'text-on-surface border-b-2 border-primary'
                : 'text-on-surface-variant'
            }`}
          >
            Aguardando
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-label ${
              mobileTab === 'waiting' ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {String(waiting.length).padStart(2, '0')}
            </span>
          </button>
          <button
            onClick={() => setMobileTab('called')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest font-headline transition-colors flex flex-col items-center gap-0.5 ${
              mobileTab === 'called'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant'
            }`}
          >
            Chamados
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-label ${
              mobileTab === 'called' ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {String(called.length).padStart(2, '0')}
            </span>
          </button>
          <button
            onClick={() => setMobileTab('attended')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest font-headline transition-colors flex flex-col items-center gap-0.5 ${
              mobileTab === 'attended'
                ? 'text-on-surface border-b-2 border-primary'
                : 'text-on-surface-variant'
            }`}
          >
            Atendidos
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-label ${
              mobileTab === 'attended' ? 'bg-surface-container-high text-on-surface' : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {attended.length}
            </span>
          </button>
        </div>

        {/* ── Mobile: single-column content (tabs) ── */}
        <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

          {/* Waiting tab */}
          {mobileTab === 'waiting' && (
            <>
              {waiting.length === 0 && (
                <p className="text-on-surface-variant/40 text-sm text-center pt-8 font-label uppercase tracking-widest">
                  Fila vazia
                </p>
              )}
              {waiting.map((entry) => (
                <WaitingCard key={entry.id} entry={entry} />
              ))}
            </>
          )}

          {/* Called tab */}
          {mobileTab === 'called' && (
            <div className="bg-surface-container-low rounded-[2rem] p-4 border border-primary/5 space-y-4">
              {called.length === 0 && (
                <p className="text-on-surface-variant/40 text-sm text-center pt-8 font-label uppercase tracking-widest">
                  Nenhum chamado
                </p>
              )}
              {called.map((entry) => (
                <CalledCard
                  key={entry.id}
                  entry={entry}
                  onMarkAttended={markAttended}
                />
              ))}
            </div>
          )}

          {/* Attended tab */}
          {mobileTab === 'attended' && (
            <div className="opacity-70 space-y-3">
              {attended.length === 0 && (
                <p className="text-on-surface-variant/40 text-sm text-center pt-8 font-label uppercase tracking-widest">
                  Nenhum atendido
                </p>
              )}
              {attended.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between border border-outline-variant/5"
                >
                  <div>
                    <p className="font-headline font-bold text-sm text-on-surface">{entry.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">
                      {entry.partySize} PAX
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-label text-on-surface-variant">ESPEROU</p>
                    <p className="text-xs font-bold font-headline">{getWaitingSince(entry.joinedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile: "Limpar fila" button at bottom */}
          <div className="pt-4">
            <button
              onClick={handleClearAll}
              className="w-full border border-outline-variant/20 text-on-surface-variant hover:text-on-surface py-3 rounded-xl font-headline font-bold text-[10px] uppercase tracking-widest transition-colors"
            >
              Limpar fila
            </button>
          </div>
        </div>

        {/* ── Desktop: 3-column grid ── */}
        <section className="hidden md:grid flex-1 p-8 grid-cols-3 gap-8 overflow-hidden">

          {/* Column 1 — Aguardando */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <h2 className="font-headline font-extrabold text-lg uppercase tracking-tight">
                  Aguardando
                </h2>
                <span className="text-xs font-label bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface-variant">
                  {String(waiting.length).padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {waiting.length === 0 && (
                <p className="text-on-surface-variant/40 text-sm text-center pt-8 font-label uppercase tracking-widest">
                  Fila vazia
                </p>
              )}
              {waiting.map((entry) => (
                <WaitingCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>

          {/* Column 2 — Chamados */}
          <div className="flex flex-col min-h-0 bg-surface-container-low rounded-[2rem] p-4 border border-primary/5">
            <div className="flex items-center justify-between mb-6 px-4 pt-2">
              <div className="flex items-center gap-3">
                <h2 className="font-headline font-extrabold text-lg uppercase tracking-tight text-primary">
                  Chamados
                </h2>
                <span className="text-xs font-label bg-primary/20 px-2 py-0.5 rounded-md text-primary">
                  {String(called.length).padStart(2, '0')}
                </span>
              </div>
              <span
                className="material-symbols-outlined text-on-surface-variant"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                notifications_active
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar px-2">
              {called.length === 0 && (
                <p className="text-on-surface-variant/40 text-sm text-center pt-8 font-label uppercase tracking-widest">
                  Nenhum chamado
                </p>
              )}
              {called.map((entry) => (
                <CalledCard
                  key={entry.id}
                  entry={entry}
                  onMarkAttended={markAttended}
                />
              ))}
            </div>
          </div>

          {/* Column 3 — Atendidos */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <h2 className="font-headline font-extrabold text-lg uppercase tracking-tight opacity-50">
                  Atendidos
                </h2>
                <span className="text-xs font-label bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface-variant">
                  {attended.length}
                </span>
              </div>
              <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">
                Sessão atual
              </p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 opacity-40">
              {attended.length === 0 && (
                <p className="text-on-surface-variant/40 text-sm text-center pt-8 font-label uppercase tracking-widest">
                  Nenhum atendido
                </p>
              )}
              {attended.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between border border-outline-variant/5"
                >
                  <div>
                    <p className="font-headline font-bold text-sm text-on-surface">{entry.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-w