'use client';

import { useMemo, useState } from 'react';
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
    const [mode, setMode] = useState<'visualize' | 'compare'>('visualize');
    const [selectedVisualId, setSelectedVisualId] = useState<number | null>(
        null,
    );
    const [leftId, setLeftId] = useState<number | null>(null);
    const [rightId, setRightId] = useState<number | null>(null);

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

    function handleModeChange(nextMode: 'visualize' | 'compare') {
        setMode(nextMode);
        setSelectedVisualId(null);
        setLeftId(null);
        setRightId(null);
    }

    const launchCount = launches.length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <RocketNavbar
                activeState={mode}
                onChangeState={handleModeChange}
                items={navItems}
            />
            <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
                <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.26em] text-sky-400">
                                Modo
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold text-white">
                                {mode === 'compare'
                                    ? 'Comparar lançamentos'
                                    : 'Visualizar lançamentos'}
                            </h1>
                        </div>
                        <div className="rounded-2xl bg-slate-950/90 px-4 py-3 text-sm text-slate-300">
                            {launchCount} lançamentos disponíveis
                        </div>
                    </div>
                </section>

                {mode === 'visualize' ? (
                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                        <aside className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-100">
                                        Lançamentos
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Clique em um lançamento para ver o
                                        gráfico.
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                    {launchCount}
                                </span>
                            </div>
                            <ul className="space-y-2">
                                {launches.map((launch) => (
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
                        </aside>

                        <section>
                            {selectedLaunch ? (
                                <ChartAreaDefault
                                    chartData={selectedLaunch.chartData}
                                    apogee={
                                        selectedLaunch.chartData.length
                                            ? Math.max(
                                                  ...selectedLaunch.chartData.map(
                                                      (item) => item.altitude,
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
                                <SkeletonCard title="Gráfico aguardando seleção" />
                            )}
                        </section>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-100">
                                        Lado A
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Escolha o primeiro lançamento.
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                    {launchCount}
                                </span>
                            </div>
                            <ul className="space-y-2">
                                {launches.map((launch) => (
                                    <li key={`left-${launch.id_tipo}`}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLeftId(launch.id_tipo)
                                            }
                                            className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-sky-500 hover:bg-slate-900"
                                        >
                                            {launch.titulo}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
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

                        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-100">
                                        Lado B
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Escolha o segundo lançamento.
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                    {launchCount}
                                </span>
                            </div>
                            <ul className="space-y-2">
                                {launches.map((launch) => (
                                    <li key={`right-${launch.id_tipo}`}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRightId(launch.id_tipo)
                                            }
                                            className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-sky-500 hover:bg-slate-900"
                                        >
                                            {launch.titulo}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
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
