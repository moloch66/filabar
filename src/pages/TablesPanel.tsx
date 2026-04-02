import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTables } from '../hooks/useTables'
import { useQueue } from '../hooks/useQueue'
import TableCard, { STATUS_CYCLE } from '../components/TableCard'
import { getWaitingSince } from '../utils/localStorage'
import type { TableArea } from '../types/tables'

export default function TablesPanel() {
  const navigate = useNavigate()
  const { internal, external, assign, setStatus } = useTables()
  const { waiting } = useQueue()

  const [activeArea, setActiveArea] = useState<TableArea>('internal')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [assignMode, setAssignMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tables = activeArea === 'internal' ? internal : external

  const selectedClient = useMemo(
    () => waiting.find((e) => e.id === selectedClientId) ?? null,
    [waiting, selectedClientId]
  )

  const freeCount = tables.filter((t) => t.status === 'free').length
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length
  const reservedCount = tables.filter((t) => t.status === 'reserved').length

  function handleTableClick(tableId: string) {
    const table = tables.find((t) => t.id === tableId)
    if (!table) return

    if (assignMode) {
      if (selectedClientId && table.status === 'free') {
        assign(tableId, selectedClientId)
        setSelectedClientId(null)
        setAssignMode(false)
      }
      return
    }

    // Normal mode: cycle status
    setStatus(tableId, STATUS_CYCLE[table.status])
  }

  function handleEnterAssignMode() {
    setAssignMode(true)
    setSelectedClientId(null)
  }

  function handleCancelAssign() {
    setAssignMode(false)
    setSelectedClientId(null)
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
            <div
              className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all rounded-xl cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              <span className="material-symbols-outlined">hourglass_empty</span>
              <span className="font-headline text-sm font-bold uppercase tracking-widest">
                Fila ao vivo
              </span>
            </div>
            <div className="flex items-center gap-4 px-4 py-3 bg-surface-container-highest text-primary rounded-xl shadow-neon-primary cursor-default">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                table_restaurant
              </span>
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
        <header className="h-16 md:h-20 bg-surface/60 backdrop-blur-[20px] flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 border-b border-outline-variant/5 gap-3">

          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-on-surface-variant hover:text-on-surface flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <button
              onClick={() => navigate('/fila')}
              className="md:hidden font-brand font-black italic text-lg tracking-tighter text-primary hover:opacity-70 transition-opacity"
            >
              FILABAR
            </button>
            <nav className="hidden md:flex items-center gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant">
              <span>Painel</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface">Mesas</span>
            </nav>
          </div>

          {/* Center: area toggle */}
          <div className="flex bg-surface-container-low rounded-xl p-1 gap-1 flex-shrink-0">
            <button
              onClick={() => setActiveArea('internal')}
              className={`px-3 md:px-5 py-2 rounded-lg font-headline font-bold text-[11px] uppercase tracking-widest transition-all ${
                activeArea === 'internal'
                  ? 'bg-primary text-on-primary shadow-neon-primary-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="hidden sm:inline">Área </span>Interna
            </button>
            <button
              onClick={() => setActiveArea('external')}
              className={`px-3 md:px-5 py-2 rounded-lg font-headline font-bold text-[11px] uppercase tracking-widest transition-all ${
                activeArea === 'external'
                  ? 'bg-primary text-on-primary shadow-neon-primary-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="hidden sm:inline">Área </span>Externa
            </button>
          </div>

          {/* Right: stats + action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Stats (desktop) */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] font-label text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                {freeCount} livres
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {reservedCount} reservadas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error" />
                {occupiedCount} ocupadas
              </span>
            </div>

            {assignMode ? (
              <button
                onClick={handleCancelAssign}
                className="border border-outline-variant/20 text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-xl font-headline font-bold text-[10px] uppercase tracking-widest transition-colors"
              >
                Cancelar
              </button>
            ) : (
              <button
                onClick={handleEnterAssignMode}
                disabled={waiting.length === 0}
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary-container px-3 md:px-5 py-2 md:py-2.5 rounded-full font-headline font-bold text-sm flex items-center gap-2 shadow-neon-primary-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  person_add
                </span>
                <span className="hidden sm:inline">Associar cliente</span>
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              title="Ir para entrada da fila"
            >
              <span className="material-symbols-outlined">open_in_new</span>
            </button>
          </div>
        </header>

        {/* ── Content: split in assign mode ── */}
        <div className="flex-1 flex overflow-hidden">

          {/* Client list panel (assign mode, desktop only) */}
          {assignMode && (
            <aside className="hidden md:flex w-80 flex-shrink-0 flex-col bg-surface-container-low border-r border-outline-variant/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/5">
                <h3 className="font-headline font-extrabold text-sm uppercase tracking-tight text-on-surface">
                  Fila de Espera
                </h3>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                  {selectedClient
                    ? `"${selectedClient.name}" selecionado — clique em uma mesa livre`
                    : 'Selecione um cliente para associar'}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {waiting.length === 0 && (
                  <p className="text-on-surface-variant/40 text-xs text-center pt-8 font-label uppercase tracking-widest">
                    Fila vazia
                  </p>
                )}
                {waiting.map((entry) => {
                  const isSelected = selectedClientId === entry.id
                  return (
                    <button
                      key={entry.id}
                      onClick={() =>
                        setSelectedClientId((prev) => (prev === entry.id ? null : entry.id))
                      }
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-primary/15 border border-primary/30 shadow-neon-primary'
                          : 'bg-surface-container hover:bg-surface-container-high border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-brand font-bold text-sm flex-shrink-0 ${
                            isSelected
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-headline font-bold text-sm text-on-surface truncate">
                            {entry.name}
                          </p>
                          <p className="text-[11px] text-on-surface-variant font-label">
                            {entry.partySize} {entry.partySize === 1 ? 'pessoa' : 'pessoas'} ·{' '}
                            {getWaitingSince(entry.joinedAt)} esperando
                          </p>
                        </div>
                        <span className="font-brand font-bold text-sm text-primary flex-shrink-0">
                          #{entry.position}
                        </span>
                      </div>
                      {entry.areaPreference && (
                        <div className="mt-2 ml-11">
                          <span className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant/60">
                            Prefere:{' '}
                            {entry.areaPreference === 'internal' ? 'Área Interna' : 'Área Externa'}
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Mobile assign hint */}
              <div className="p-4 border-t border-outline-variant/5">
                <p className="text-[10px] font-label text-on-surface-variant/50 text-center leading-relaxed">
                  Selecione um cliente acima, depois clique em uma mesa livre no mapa.
                </p>
              </div>
            </aside>
          )}

          {/* ── Table grid ── */}
          <section className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-5 md:p-8">

              {/* Section heading */}
              <div className="flex flex-wrap items-baseline gap-3 mb-6">
                <h2 className="font-brand font-extrabold text-xl text-on-surface tracking-tight">
                  {activeArea === 'internal' ? 'Mesas Internas' : 'Mesas Externas'}
                </h2>
                <span className="text-[11px] font-label uppercase tracking-widest text-on-surface-variant">
                  {tables.length} mesas · {freeCount} {freeCount === 1 ? 'livre' : 'livres'}
                </span>
              </div>

              {/* Assign mode hints */}
              {assignMode && !selectedClient && (
                <div className="mb-6 flex items-center gap-3 bg-primary/10 text-primary px-4 py-3 rounded-xl">
                  <span className="material-symbols-outlined text-base">info</span>
                  <p className="text-xs font-label">
                    <span className="md:hidden">Selecione um cliente na lista acima.</span>
                    <span className="hidden md:inline">
                      Selecione um cliente na lista à esquerda para associar a uma mesa livre.
                    </span>
                  </p>
                </div>
              )}

              {assignMode && selectedClient && (
                <div className="mb-6 flex items-center gap-3 bg-primary/15 border border-primary/20 text-primary px-4 py-3 rounded-xl">
                  <span
                    className="material-symbols-outlined text-base flex-shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    person
                  </span>
                  <p className="text-xs font-label">
                    <span className="font-bold">{selectedClient.name}</span> selecionado —
                    clique em uma mesa livre abaixo.
                  </p>
                </div>
              )}

              {/* Mobile assign: client scrollable strip */}
              {assignMode && (
                <div className="md:hidden mb-6 -mx-1">
                  <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant px-1 mb-2">
                    Selecione um cliente
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar px-1">
                    {waiting.length === 0 && (
                      <p className="text-on-surface-variant/40 text-xs font-label py-2">
                        Fila vazia
                      </p>
                    )}
                    {waiting.map((entry) => {
                      const isSelected = selectedClientId === entry.id
                      return (
                        <button
                          key={entry.id}
                          onClick={() =>
                            setSelectedClientId((prev) => (prev === entry.id ? null : entry.id))
                          }
                          className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                            isSelected
                              ? 'bg-primary/20 border border-primary/40'
                              : 'bg-surface-container border border-transparent hover:bg-surface-container-high'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-brand font-bold text-xs flex-shrink-0 ${
                              isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <p className="font-headline font-bold text-xs text-on-surface whitespace-nowrap">
                              {entry.name}
                            </p>
                            <p className="text-[10px] text-on-surface-variant">
                              {entry.partySize} pax
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Table grid: 2 cols mobile, 3 cols sm, 4 cols md+ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {tables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    isTarget={assignMode && !!selectedClientId && table.status === 'free'}
                    assignMode={assignMode}
                    onClick={handleTableClick}
                  />
                ))}
              </div>

              {/* Legend + hint */}
              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-outline-variant/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-success" />
                  <span className="text-[11px] font-label text-on-surface-variant uppercase tracking-wider">
                    Livre
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-label text-on-surface-variant uppercase tracking-wider">
                    Reservada
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-error" />
                  <span className="text-[11px] font-label text-on-surface-variant uppercase tracking-wider">
                    Ocupada
                  </span>
                </div>
                {!assignMode && (
                  <span className="text-[10px] font-label text-on-surface-variant/40 ml-auto">
                    Clique para alterar status
                  </span>
                )}
              </div>

            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
