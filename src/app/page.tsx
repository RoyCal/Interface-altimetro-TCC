import { LaunchDashboard } from '@/components/launch-dashboard';
import {
    getChartDataByType,
    findAllTiposValores,
    findUsuarioById,
    findDataMedicaoByTipo,
} from '@/lib/db';

export default async function Home() {
    const launches = await findAllTiposValores();
    const launchesWithData = await Promise.all(
        launches.map(async (launch) => {
            const usuario = await findUsuarioById(launch.id_usuario);
            const chartData = await getChartDataByType(launch.id_tipo);
            const launchDate = await findDataMedicaoByTipo(launch.id_tipo)
            return {
                ...launch,
                usuario,
                chartData,
                launchDate,
            };
        }),
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <LaunchDashboard launches={launchesWithData} />
        </div>
    );
}
