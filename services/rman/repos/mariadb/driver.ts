import mariadb from "mariadb";
import { Result, Logger } from "@cosmo/core";

const trace = (...s: string[]) => Logger.Trace("MariaDB.Driver:", ...s);
const error = (...s: string[]) => Logger.Error("MariaDB.Driver:", ...s);

class MariaDB {
	private static pool: mariadb.Pool | null = null;

	public static get IsInitialized(): boolean {
		return MariaDB.pool !== null;
	}

	public static Initialize(): void {
		trace("Creating connection pool");
		MariaDB.pool = mariadb.createPool({
			host: process.env.MARIADB_HOST,
			user: process.env.MARIADB_USER,
			password: process.env.MARIADB_PASSWORD,
			database: process.env.MARIADB_DATABASE,
			connectionLimit: 5
		});
	}

	public static async Query<R = unknown>(q: string): AsyncResult<R> {
		trace("Checking if initialized");
		if (!MariaDB.IsInitialized || !MariaDB.pool) {
			error("Driver not initialized");
			return Result.Err({
				code: "driver_not_initialized",
				message: "The MariaDB driver was not initialized"
			});
		}

		trace("Getting connection from pool");
		const conn = await MariaDB.pool.getConnection();
		trace(
			`Pool info (active: ${MariaDB.pool.activeConnections()}, idle: ${MariaDB.pool.idleConnections()}, total: ${MariaDB.pool.totalConnections()})`
		);

		try {
			trace(`Querying (${q})`);
			const rows = await conn.query(q);

			trace("Closing pool connection");
			await conn.end();

			return Result.Ok(rows);
		} catch (e) {
			trace("Closing pool connection");
			await conn.end();

			error("Invalid query");
			return Result.Err({
				code: "invalid_sql_query",
				message: "The query was invalid",
				detail: {
					query: q,
					error: e
				}
			});
		}
	}
}

export default MariaDB;
