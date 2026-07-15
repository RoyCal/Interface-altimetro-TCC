import mysql, { type RowDataPacket } from 'mysql2/promise';

const globalForMysql = global as typeof globalThis & {
    pool?: mysql.Pool;
};

export const db =
    globalForMysql.pool ??
    mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

if (process.env.NODE_ENV !== 'production') {
    globalForMysql.pool = db;
}

export type ChartDataPoint = {
    altitude: number;
    time_stamp: number;
};

export async function getChartDataByType(
    idTipo: number,
): Promise<ChartDataPoint[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
        'SELECT data_medicao, valor FROM medicoes WHERE id_tipo = ? ORDER BY data_medicao',
        [idTipo],
    );

    return rows.map((row, index) => ({
        altitude: Number(row.valor),
        time_stamp: Number((index * 0.05).toFixed(2)),
        date: String(row.data_medicao),
    }));
}

export async function findDataMedicaoByTipo(
    idTipo: number,
): Promise<string | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
        'SELECT data_medicao FROM medicoes WHERE id_tipo = ? ORDER BY data_medicao LIMIT 1',
        [idTipo],
    );

    if (!rows || rows.length === 0) {
        return null;
    }

    const data = rows[0].data_medicao as Date;

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(data);
}

export type TipoValor = {
    id_tipo: number;
    id_usuario: number;
    titulo: string;
    descricao: string | null;
};

export type Usuario = {
    id_usuario: number;
    usuario: string;
};

export async function findAllTiposValores(): Promise<TipoValor[]> {
    try {
        const [rows] = await db.execute<RowDataPacket[]>(
            'SELECT id_tipo, id_usuario, titulo, descricao FROM tipos_valores',
            [],
        );

        return rows.map((row) => ({
            id_tipo: Number(row.id_tipo),
            id_usuario: Number(row.id_usuario),
            titulo: String(row.titulo),
            descricao: row.descricao == null ? null : String(row.descricao),
        }));
    } catch {
        return [];
    }
}

export async function findTiposValoresByTituloContains(
    termo: string,
): Promise<TipoValor[]> {
    try {
        const [rows] = await db.execute<RowDataPacket[]>(
            'SELECT id_tipo, id_usuario, titulo, descricao FROM tipos_valores WHERE titulo LIKE ? ORDER BY titulo LIMIT 50',
            [`%${termo}%`],
        );

        return rows.map((row) => ({
            id_tipo: Number(row.id_tipo),
            id_usuario: Number(row.id_usuario),
            titulo: String(row.titulo),
            descricao: row.descricao == null ? null : String(row.descricao),
        }));
    } catch {
        return []
    }
}

export async function findTipoValorById(
    idTipo: number,
): Promise<TipoValor | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
        'SELECT id_tipo, id_usuario, titulo, descricao FROM tipos_valores WHERE id_tipo = ?',
        [idTipo],
    );

    if (!rows || rows.length === 0) return null;

    const row = rows[0];
    return {
        id_tipo: Number(row.id_tipo),
        id_usuario: Number(row.id_usuario),
        titulo: String(row.titulo),
        descricao: row.descricao == null ? null : String(row.descricao),
    };
}

export async function findUsuarioById(
    idUsuario: number | undefined,
): Promise<Usuario | null> {
    if (idUsuario === undefined) {
        return null;
    }

    const [rows] = await db.execute<RowDataPacket[]>(
        'SELECT id_usuario, usuario FROM usuarios WHERE id_usuario = ?',
        [idUsuario],
    );

    if (!rows || rows.length === 0) return null;

    const row = rows[0];
    return {
        id_usuario: Number(row.id_usuario),
        usuario: String(row.usuario),
    };
}
