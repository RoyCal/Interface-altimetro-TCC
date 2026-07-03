'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
};

interface TipoValor {
    id_tipo: number;
    id_usuario: number;
    titulo: string;
    descricao: string | null;
}

interface Usuario {
    id_usuario: number;
    usuario: string;
};

interface ChartAreaDefaultProps {
    chartData: ChartDataPoint[];
    apogee: number | undefined;
    flight_time: number | undefined;
    type_data: TipoValor | null;
    usuario: Usuario | null;
}

const chartConfig = {
    desktop: {
        label: 'Altura',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

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
        <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
            <div className="mb-1 font-medium text-foreground">Ponto medido</div>
            <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>Tempo</span>
                <span className="font-mono text-foreground">
                    {Number(timeValue).toFixed(2)} s
                </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>Altura</span>
                <span className="font-mono text-foreground">
                    {Number(altitudeValue).toFixed(2)} m
                </span>
            </div>
        </div>
    );
}

export function ChartAreaDefault({ chartData, apogee, flight_time, type_data, usuario }: ChartAreaDefaultProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl'>{type_data?.titulo}</CardTitle>
                <CardDescription className='text-xl'>
                    <span>Apogeu: {apogee}m</span>
                </CardDescription>
                <CardDescription className='text-xl'>
                    <span>Tempo total de voo: {flight_time}s</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        className='text-lg'
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 80,
                            right: 160,
                            top: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time_stamp"
                            tickLine={true}
                            axisLine={true}
                            tickMargin={4}
                            tickFormatter={(value) => Number(value).toFixed(1)}
                            label={{
                                value: 'Tempo (s)',
                                position: 'right',
                                offset: 40
                            }}
                        />
                        <YAxis
                            dataKey="altitude"
                            tickLine={true}
                            axisLine={true}
                            tickMargin={8}
                            label={{
                                value: 'Altura (m)',
                                angle: 0,
                                position: 'insideLeft',
                                offset: -70
                            }}
                        />
                        <ChartTooltip
                            cursor={true}
                            content={<CustomTooltip />}
                        />
                        <Area
                            dataKey="altitude"
                            type="linear"
                            fill="var(--color-desktop)"
                            fillOpacity={0.7}
                            stroke="var(--color-desktop)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex flex-col text-lg'>
                <div>
                    Descrição: {type_data?.descricao}
                </div>

                <div>Cadastrado pelo usuário: {usuario?.id_usuario} - {usuario?.usuario}</div>
            </CardFooter>
        </Card>
    );
}
