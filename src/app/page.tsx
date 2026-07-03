import { ChartAreaDefault } from '@/components/chart';
import { getChartDataByType, findTipoValorById, findUsuarioById } from '@/lib/db';

interface ChartData {
  altitude: number;
  time_stamp: number;
};

function getApogee(data: ChartData[]): number | undefined {
  if (data.length === 0) return undefined;

  return Number(data.reduce(
    (maior, item) => Math.max(maior, item.altitude),
    data[0].altitude
  ).toFixed(2));
}

function getFlightTime(data: ChartData[]): number | undefined {
    if (data.length === 0) return undefined;

    return data.at(-1)?.time_stamp
}

const idTipoValor = 4

export default async function Home() {
    const chartData = await getChartDataByType(idTipoValor);
    const tipoValor = await findTipoValorById(idTipoValor)
    const usuario = await findUsuarioById(tipoValor?.id_usuario)

    return (
        <div className="p-20 border-2 border-amber-400">
            <ChartAreaDefault chartData={chartData} apogee={getApogee(chartData)} flight_time={getFlightTime(chartData)} type_data={tipoValor} usuario={usuario}/>
        </div>
    );
}
