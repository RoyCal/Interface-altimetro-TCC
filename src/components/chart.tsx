'use client';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    XAxis,
    YAxis,
} from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from '@/components/ui/chart';

interface ChartDataPoint {
    altitude: number;
    time_stamp: number;
}

interface TipoValor {
    id_tipo: number;
    id_usuario: number;
    titulo: string;
    descricao: string | null;
}

interface Usuario {
    id_usuario: number;
    usuario: string;
}

interface ChartAreaDefaultProps {
    chartData: ChartDataPoint[];
    apogee: number | undefined;
    flight_time: number | undefined;
    type_data: TipoValor | null;
    usuario: Usuario | null;
}

const chartConfig = {
    altitude: {
        label: 'Altura',
        color: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
    },
} satisfies ChartConfig;

function formatDuration(seconds: number): string {
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts: string[] = [];

  if (m > 0) parts.push(`${m} min`);
  if (s > 0 || parts.length === 0) parts.push(`${s} s`);

  return parts.join(" ");
}

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ value?: number | string; payload?: ChartDataPoint }>;
    label?: string | number;
}) {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0]?.payload;
    const timeValue = point?.time_stamp ?? Number(label ?? 0);
    const altitudeValue = point?.altitude ?? payload[0]?.value ?? 0;

    return (
        <div className="rounded-3xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-sm shadow-xl">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-sky-400">
                Dados do ponto
            </div>
            <div className="grid gap-2">
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-900/80 px-3 py-2 text-slate-200">
                    <span className="text-slate-400">Tempo</span>
                    <span className="font-mono font-semibold">
                        {Number(timeValue).toFixed(2)} s
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-900/80 px-3 py-2 text-slate-200">
                    <span className="text-slate-400">Altura</span>
                    <span className="font-mono font-semibold">
                        {Number(altitudeValue).toFixed(2)} m
                    </span>
                </div>
            </div>
        </div>
    );
}

export function ChartAreaDefault({
    chartData,
    apogee,
    flight_time,
    type_data,
    usuario,
}: ChartAreaDefaultProps) {
    return (
        <Card className="flex h-full w-full max-h-[calc(100vh-8rem)] flex-col rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl shadow-slate-950/40">
            <CardHeader className="space-y-3 border-b border-slate-800/70 px-6 py-6">
                <div className="flex gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <CardTitle className="text-3xl font-semibold tracking-tight text-slate-100">
                            {type_data?.titulo}
                        </CardTitle>
                        <CardDescription className="mt-2 max-w-2xl text-lg leading-6 text-slate-400">
                            {type_data?.descricao ??
                                'Dados de altitude do voo com frequência de 20Hz.'}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2 text-right text-lg text-slate-300">
                        <span className="font-semibold text-slate-100">
                            Apogeu:
                        </span>
                        <span>
                            {apogee != null ? `${apogee.toFixed(2)} m` : '—'}
                        </span>
                        <span className="font-semibold text-slate-100">
                            Tempo total
                        </span>
                        <span>
                            {flight_time != null
                                ? `${formatDuration(flight_time)}`
                                : '—'}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-hidden px-6 py-6">
                <ChartContainer config={chartConfig} className="h-full min-h-0">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 20,
                            right: 20,
                            top: 10,
                            bottom: 30,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="altitudeGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#38bdf8"
                                    stopOpacity={0.55}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#0f172a"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            stroke="#334155"
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="time_stamp"
                            tickLine={true}
                            axisLine={true}
                            tickMargin={12}
                            tickFormatter={(value) => Number(value).toFixed(1)}
                            stroke="#94a3b8"
                            tick={{ fill: '#cbd5e1', fontSize: 12 }}
                            label={{
                                value: 'Tempo (s)',
                                position: 'insideBottom',
                                offset: -20,
                                fill: '#94a3b8',
                                fontSize: 20,
                            }}
                        />
                        <YAxis
                            dataKey="altitude"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            stroke="#94a3b8"
                            tick={{ fill: '#cbd5e1', fontSize: 12 }}
                            label={{
                                value: 'Altura (m)',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 0,
                                fill: '#94a3b8',
                                fontSize: 20,
                            }}
                        />
                        {apogee != null && (
                            <ReferenceLine
                                y={apogee}
                                stroke="#38bdf8"
                                strokeDasharray="4 4"
                                label={{
                                    value: `Apogeu`,
                                    position: 'left',
                                    fill: '#38bdf8',
                                    fontSize: 12,
                                }}
                            />
                        )}
                        <ChartTooltip
                            cursor={true}
                            content={<CustomTooltip />}
                        />
                        <Area
                            dataKey="altitude"
                            type="linear"
                            stroke="#38bdf8"
                            strokeWidth={3}
                            fill="url(#altitudeGradient)"
                            fillOpacity={0.9}
                            isAnimationActive={true}
                            dot={false}
                            activeDot={{
                                fill: '#38bdf8',
                                stroke: '#ffffff',
                                strokeWidth: 2,
                                r: 4,
                            }}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/70 px-6 py-4 text-sm text-slate-300">
                <div className="max-w-xl leading-6">
                    Exibindo a evolução da altitude ao longo do tempo, com
                    destaque para o apogeu no voo.
                </div>
                <div className="rounded-2xl bg-slate-900/80 px-4 py-2 text-slate-200">
                    Usuário:{' '}
                    {usuario
                        ? `${usuario.id_usuario} — ${usuario.usuario}`
                        : 'Não informado'}
                </div>
            </CardFooter>
        </Card>
    );
}
