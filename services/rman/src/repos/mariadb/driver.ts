import mariadb from "mariadb";
import { Result, NEVER } from "@cosmo/core";
import { getFromEnv } from "../../utils/index.js";

class MariaDB {
	private static pool: mariadb.Pool | null = null;

	public static get IsInitialized(): boolean {
		return MariaDB.pool !== null;
	}

	public static Initialize(): Result<never> {
		const hostResult = getFromEnv("MARIADB_HOST");
		if (hostResult.IsErr) return hostResult.AsErr();

		const userResult = getFromEnv("MARIADB_HOST");
		if (userResult.IsErr) return userResult.AsErr();

		const passwordResult = getFromEnv("MARIADB_HOST");
		if (passwordResult.IsErr) return passwordResult.AsErr();

		const databaseResult = getFromEnv("MARIADB_HOST");
		if (databaseResult.IsErr) return databaseResult.AsErr();

		MariaDB.pool = mariadb.createPool({
			host: hostResult.Unwrap(),
			user: userResult.Unwrap(),
			password: passwordResult.Unwrap(),
			database: databaseResult.Unwrap(),
			connectionLimit: 5
		});

		return Result.Ok(NEVER);
	}

	public static async Query<R = unknown>(q: string): AsyncResult<R> {
		if (!MariaDB.IsInitialized || !MariaDB.pool) {
			return Result.Err({
				code: "driver_not_initialized",
				message: "The MariaDB driver was not initialized"
			});
		}

		const conn = await MariaDB.pool.getConnection();

		try {
			const rows = await conn.query(q);
			await conn.end();
			return Result.Ok(rows);
		} catch (e) {
			await conn.end();
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
