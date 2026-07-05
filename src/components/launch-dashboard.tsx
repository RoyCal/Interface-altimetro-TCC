'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ChartAreaDefault } from './chart';
import { RocketNavbar } from './navbar';
import type { TipoValor, Usuario } from '@/lib/db';

interface ChartData {
    altitude: number;
    time_stamp: number;
}

interface LaunchWithData extends TipoValor {
    usuario: Usuario | null;
    chartData: ChartData[];
}

interface LaunchDashboardProps {
    launches: LaunchWithData[];
}

const navItems = [
    { label: 'Visualizar lançamentos', state: 'visualize' },
    { label: 'Comparar lançamentos', state: 'compare' },
];

function SkeletonCard({ title }: { title: string }) {
    return (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <p className="text-lg font-semibold text-slate-100">
                        {title}
                    </p>
                    <p className="text-sm text-slate-400">
                        Selecione um lançamento para mostrar o gráfico aqui.
                    </p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-slate-800/80" />
            </div>
            <div className="space-y-3">
                <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-slate-800" />
                <div className="h-3.5 w-full animate-pulse rounded-full bg-slate-800" />
                <div className="h-3.5 w-5/6 animate-pulse rounded-full bg-slate-800" />
                <div className="mt-8 h-72 rounded-3xl bg-slate-800/80" />
            </div>
        </div>
    );
}

export function LaunchDashboard({ launches }: LaunchDashboardProps) {
    const [mode, setMode] = useState('visualize');
    const [selectedVisualId, setSelectedVisualId] = useState<number | null>(
        null,
    );
    const [leftId, setLeftId] = useState<number | null>(null);
    const [rightId, setRightId] = useState<number | null>(null);
    const [searchQueryVisual, setSearchQueryVisual] = useState('');
    const [searchQueryLeft, setSearchQueryLeft] = useState('');
    const [searchQueryRight, setSearchQueryRight] = useState('');
    const [searchResultsVisual, setSearchResultsVisual] =
        useState<LaunchWithData[]>(launches);
    const [searchResultsLeft, setSearchResultsLeft] =
        useState<LaunchWithData[]>(launches);
    const [searchResultsRight, setSearchResultsRight] =
        useState<LaunchWithData[]>(launches);
    const [isSearchingVisual, setIsSearchingVisual] = useState(false);
    const [isSearchingLeft, setIsSearchingLeft] = useState(false);
    const [isSearchingRight, setIsSearchingRight] = useState(false);

    const selectedLaunch = useMemo(
        () =>
            launches.find((launch) => launch.id_tipo === selectedVisualId) ??
            null,
        [launches, selectedVisualId],
    );

    const leftLaunch = useMemo(
        () => launches.find((launch) => launch.id_tipo === leftId) ?? null,
        [launches, leftId],
    );

    const rightLaunch = useMemo(
        () => launches.find((launch) => launch.id_tipo === rightId) ?? null,
        [launches, rightId],
    );

    function handleModeChange(nextMode: string) {
        setMode(nextMode);
        setSelectedVisualId(null);
        setLeftId(null);
        setRightId(null);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchResultsVisual(launches);
        setSearchResultsLeft(launches);
        setSearchResultsRight(launches);
    }, [launches]);

    async function searchLaunches(
        query: string,
        side: 'visual' | 'left' | 'right',
    ) {
        const normalizedQuery = query.trim();

        if (side === 'visual') {
            setIsSearchingVisual(true);

            try {
                if (!normalizedQuery) {
                    setSearchResultsVisual(launches);
                    return;
                }

                const response = await fetch(
                    `/api/launches/search?q=${encodeURIComponent(normalizedQuery)}`,
                    { cache: 'no-store' },
                );

                if (!response.ok) {
                    throw new Error('Falha ao buscar lançamentos');
                }

                const data = (await response.json()) as LaunchWithData[];
                setSearchResultsVisual(data);
            } catch {
                setSearchResultsVisual([]);
            } finally {
                setIsSearchingVisual(false);
            }

            return;
        }

        if (side === 'left') {
            setIsSearchingLeft(true);

            try {
                if (!normalizedQuery) {
                    setSearchResultsLeft(launches);
                    return;
                }

                const response = await fetch(
                    `/api/launches/search?q=${encodeURIComponent(normalizedQuery)}`,
                    { cache: 'no-store' },
                );

                if (!response.ok) {
                    throw new Error('Falha ao buscar lançamentos');
                }

                const data = (await response.json()) as LaunchWithData[];
                setSearchResultsLeft(data);
            } catch {
                setSearchResultsLeft([]);
            } finally {
                setIsSearchingLeft(false);
            }

            return;
        }

        setIsSearchingRight(true);

        try {
            if (!normalizedQuery) {
                setSearchResultsRight(launches);
                return;
            }

            const response = await fetch(
                `/api/launches/search?q=${encodeURIComponent(normalizedQuery)}`,
                { cache: 'no-store' },
            );

            if (!response.ok) {
                throw new Error('Falha ao buscar lançamentos');
            }

            const data = (await response.json()) as LaunchWithData[];
            setSearchResultsRight(data);
        } catch {
            setSearchResultsRight([]);
        } finally {
            setIsSearchingRight(false);
        }
    }

    function resetSearch(side: 'visual' | 'left' | 'right') {
        if (side === 'visual') {
            setSearchQueryVisual('');
            setSearchResultsVisual(launches);
            return;
        }

        if (side === 'left') {
            setSearchQueryLeft('');
            setSearchResultsLeft(launches);
            return;
        }

        setSearchQueryRight('');
        setSearchResultsRight(launches);
    }

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
            <RocketNavbar
                activeState={mode}
                onChangeState={handleModeChange}
                items={navItems}
            />
            <main className="flex-1 min-h-0 overflow-hidden w-full space-y-8 px-6 py-6">
                {mode === 'visualize' ? (
                    <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[320px_1fr]">
                        <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 shadow-xl shadow-slate-950/20">
                            <div className="m-6 mb-0 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-100">
                                        Lançamentos
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Clique em um lançamento para ver o
                                        gráfico.
                                    </p>
                                </div>
                            </div>
                            <div className="m-6 my-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={searchQueryVisual}
                                        onChange={(event) =>
                                            setSearchQueryVisual(
                                                event.target.value,
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                void searchLaunches(
                                                    searchQueryVisual,
                                                    'visual',
                                                );
                                            }
                                        }}
                                        placeholder="Buscar"
                                        className="h-10 w-full flex-1 rounded-2xl border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void searchLaunches(
                                                searchQueryVisual,
                                                'visual',
                                            )
                                        }
                                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/90 text-slate-300 transition hover:border-sky-500 hover:text-sky-400"
                                        aria-label="Buscar lançamento"
                                    >
                                        <Search className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => resetSearch('visual')}
                                        className="rounded-2xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                                    >
                                        Resetar
                                    </button>
                                </div>
                            </div>
                            <div className="custom-scrollbar flex-1 min-h-0 overflow-y-auto rounded-2xl">
                                {isSearchingVisual ? (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        Buscando...
                                    </div>
                                ) : searchResultsVisual.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        Nenhum lançamento encontrado.
                                    </div>
                                ) : (
                                    <ul className="space-y-2 px-6 pt-2">
                                        {searchResultsVisual.map((launch) => (
                                            <li key={launch.id_tipo}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedVisualId(
                                                            launch.id_tipo,
                                                        )
                                                    }
                                                    className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-sky-500 hover:bg-slate-900"
                                                >
                                                    {launch.titulo}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </aside>

                        <section className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                            <div className="flex-1 min-h-0 overflow-hidden">
                                {selectedLaunch ? (
                                    <ChartAreaDefault
                                        chartData={selectedLaunch.chartData}
                                        apogee={
                                            selectedLaunch.chartData.length
                                                ? Math.max(
                                                      ...selectedLaunch.chartData.map(
                                                          (item) =>
                                                              item.altitude,
                                                      ),
                                                  )
                                                : undefined
                                        }
                                        flight_time={
                                            selectedLaunch.chartData.length
                                                ? selectedLaunch.chartData[
                                                      selectedLaunch.chartData
                                                          .length - 1
                                                  ].time_stamp
                                                : undefined
                                        }
                                        type_data={selectedLaunch}
                                        usuario={selectedLaunch.usuario}
                                    />
                                ) : (
                                    <div className="h-full min-h-0 overflow-hidden">
                                        <SkeletonCard title="Gráfico aguardando seleção" />
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="grid h-full min-h-0 gap-6 lg:grid-cols-2">
                        <section className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-100">
                                        Lado A
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Escolha o primeiro lançamento.
                                    </p>
                                </div>
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={searchQueryLeft}
                                        onChange={(event) =>
                                            setSearchQueryLeft(
                                                event.target.value,
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                void searchLaunches(
                                                    searchQueryLeft,
                                                    'left',
                                                );
                                            }
                                        }}
                                        placeholder="Buscar"
                                        className="h-10 flex-1 rounded-2xl border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void searchLaunches(
                                                searchQueryLeft,
                                                'left',
                                            )
                                        }
                                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/90 text-slate-300 transition hover:border-sky-500 hover:text-sky-400"
                                        aria-label="Buscar lançamento"
                                    >
                                        <Search className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => resetSearch('left')}
                                        className="rounded-2xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                                    >
                                        Resetar
                                    </button>
                                </div>
                            </div>
                            <div className="custom-scrollbar mt-2 h-46 overflow-y-auto rounded-2xl border border-slate-800/70 p-2">
                                {isSearchingLeft ? (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        Buscando...
                                    </div>
                                ) : searchResultsLeft.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        Nenhum lançamento encontrado.
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {searchResultsLeft.map((launch) => (
                                            <li key={`left-${launch.id_tipo}`}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setLeftId(
                                                            launch.id_tipo,
                                                        )
                                                    }
                                                    className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-sky-500 hover:bg-slate-900"
                                                >
                                                    {launch.titulo}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="mt-6 flex-1 min-h-0 overflow-hidden">
                                {leftLaunch ? (
                                    <ChartAreaDefault
                                        chartData={leftLaunch.chartData}
                                        apogee={
                                            leftLaunch.chartData.length
                                                ? Math.max(
                                                      ...leftLaunch.chartData.map(
                                                          (item) =>
                                                              item.altitude,
                                                      ),
                                                  )
                                                : undefined
                                        }
                                        flight_time={
                                            leftLaunch.chartData.length
                                                ? leftLaunch.chartData[
                                                      leftLaunch.chartData
                                                          .length - 1
                                                  ].time_stamp
                                                : undefined
                                        }
                                        type_data={leftLaunch}
                                        usuario={leftLaunch.usuario}
                                    />
                                ) : (
                                    <SkeletonCard title="Lado A aguardando seleção" />
                                )}
                            </div>
                        </section>

                        <section className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-100">
                                        Lado B
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Escolha o segundo lançamento.
                                    </p>
                                </div>
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={searchQueryRight}
                                        onChange={(event) =>
                                            setSearchQueryRight(
                                                event.target.value,
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                void searchLaunches(
                                                    searchQueryRight,
                                                    'right',
                                                );
                                            }
                                        }}
                                        placeholder="Buscar"
                                        className="h-10 flex-1 rounded-2xl border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void searchLaunches(
                                                searchQueryRight,
                                                'right',
                                            )
                                        }
                                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/90 text-slate-300 transition hover:border-sky-500 hover:text-sky-400"
                                        aria-label="Buscar lançamento"
                                    >
                                        <Search className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => resetSearch('right')}
                                        className="rounded-2xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                                    >
                                        Resetar
                                    </button>
                                </div>
                            </div>
                            <div className="custom-scrollbar mt-2 h-46 overflow-y-auto rounded-2xl border border-slate-800/70 p-2">
                                {isSearchingRight ? (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        Buscando...
                                    </div>
                                ) : searchResultsRight.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        Nenhum lançamento encontrado.
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {searchResultsRight.map((launch) => (
                                            <li key={`right-${launch.id_tipo}`}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRightId(
                                                            launch.id_tipo,
                                                        )
                                                    }
                                                    className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-sky-500 hover:bg-slate-900"
                                                >
                                                    {launch.titulo}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="mt-6 flex-1 min-h-0 overflow-hidden">
                                {rightLaunch ? (
                                    <ChartAreaDefault
                                        chartData={rightLaunch.chartData}
                                        apogee={
                                            rightLaunch.chartData.length
                                                ? Math.max(
                                                      ...rightLaunch.chartData.map(
                                                          (item) =>
                                                              item.altitude,
                                                      ),
                                                  )
                                                : undefined
                                        }
                                        flight_time={
                                            rightLaunch.chartData.length
                                                ? rightLaunch.chartData[
                                                      rightLaunch.chartData
                                                          .length - 1
                                                  ].time_stamp
                                                : undefined
                                        }
                                        type_data={rightLaunch}
                                        usuario={rightLaunch.usuario}
                                    />
                                ) : (
                                    <SkeletonCard title="Lado B aguardando seleção" />
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}
