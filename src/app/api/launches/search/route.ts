import { NextResponse } from 'next/server';
import {
    findTiposValoresByTituloContains,
    findUsuarioById,
    getChartDataByType,
} from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() ?? '';

    if (!query) {
        return NextResponse.json([]);
    }

    const launches = await findTiposValoresByTituloContains(query);
    const launchesWithData = await Promise.all(
        launches.map(async (launch) => {
            const usuario = await findUsuarioById(launch.id_usuario);
            const chartData = await getChartDataByType(launch.id_tipo);

            return {
                ...launch,
                usuario,
                chartData,
            };
        }),
    );

    return NextResponse.json(launchesWithData);
}
