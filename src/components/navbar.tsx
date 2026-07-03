'use client';

import Image from 'next/image';
import Link from 'next/link';
export interface NavItem {
    label: string;
    state: string;
    href?: string;
}

interface RocketNavbarProps {
    title?: string;
    tagline?: string;
    items?: NavItem[];
    activeState?: string;
    onChangeState?: (state: string) => void;
}

export function RocketNavbar({
    title = 'Cangaço no Espaço',
    tagline = 'Visualizar e comparar lançamentos',
    items = [
        {
            label: 'Visualizar lançamentos',
            state: 'visualize',
            href: '/?mode=visualize',
        },
        {
            label: 'Comparar lançamentos',
            state: 'compare',
            href: '/?mode=compare',
        },
    ],
    activeState = 'visualize',
    onChangeState,
}: RocketNavbarProps) {
    return (
        <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-50 w-50 items-center justify-center">
                        <Image
                            src="/assets/cangaco_logo.png"
                            alt="Logo do Cangaço no Espaço"
                            width={500}
                            height={500}
                            loading="eager"
                        />
                    </div>
                    <div>
                        <p className="text-4xl font-semibold text-white">
                            {title}
                        </p>
                        <p className="mt-1 text-md text-slate-400">{tagline}</p>
                    </div>
                </div>

                <nav>
                    <div className="flex flex-wrap items-center gap-3">
                        {items.map((item) => {
                            const isActive = item.state === activeState;
                            if (onChangeState) {
                                return (
                                    <button
                                        key={item.state}
                                        type="button"
                                        onClick={() =>
                                            onChangeState(item.state)
                                        }
                                        className={
                                            'rounded-full px-4 py-2 text-sm font-medium transition ' +
                                            (isActive
                                                ? 'bg-sky-500 text-slate-950 border border-sky-500'
                                                : 'border border-slate-800/90 bg-slate-900/80 text-slate-100 hover:border-sky-400 hover:text-sky-300 hover:bg-slate-800')
                                        }
                                    >
                                        {item.label}
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={item.state}
                                    href={item.href ?? '#'}
                                    className={
                                        'rounded-full px-4 py-2 text-sm font-medium transition ' +
                                        (isActive
                                            ? 'bg-sky-500 text-slate-950 border border-sky-500'
                                            : 'border border-slate-800/90 bg-slate-900/80 text-slate-100 hover:border-sky-400 hover:text-sky-300 hover:bg-slate-800')
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </header>
    );
}
