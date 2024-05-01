import Repository from "..";
import Driver from "./driver";
import * as SQL from "./sql";
import { ResourceUtilities as RU, AuthEntityUtilities as AEU } from "./utils";
import { Logger, Result } from "@cosmo/core";

const trace = (s: string) => Logger.Trace("MariaDB.Repository:", s);
const error = (s: string) => Logger.Error("MariaDB.Repository:", s);

class MariaDBRepository extends Repository {
	constructor() {
		super();
		trace("Initializing driver");
		Driver.Initialize();
	}

	public async CreateResource(
		r: Ports.Resource.Middle
	): AsyncResult<Ports.Resource.Middle> {
		trace("Converting Resource from Middle to Source");
		const src = RU.MiddleToSource(r);

		trace("Building SQL query: CREATE_RESOURCE");
		const q = SQL.CREATE_RESOURCE(src);

		trace("Passing query to driver");
		const result = await Driver.Query(q);

		if (result.IsOk) {
			trace("Query was successful");
			return Result.Ok(r);
		}

		trace("Query was unsuccessful");
		return result as ErrorResult;
	}

	public async UpdateResource(r: Ports.Resource.Middle) {
		trace("Converting Resource from Middle to Source");
		const src = RU.MiddleToSource(r);

		trace("Building SQL query: UPDATE_RESOURCE");
		const q = SQL.UPDATE_RESOURCE(src);

		trace("Passing query to driver");
		const result = await Driver.Query(q);
		if (result.IsOk) {
			trace("Query was successful");
			return Result.Ok(true); // TODO: check if updated
		}

		trace("Query was unsuccessful");
		return result as ErrorResult;
	}

	public async FetchResource(id: string): AsyncResult<Ports.Resource.Middle> {
		trace("Building SQL query: FETCH_RESOURCE");
		const q = SQL.FETCH_RESOURCE(id);

		trace("Passing query to driver");
		const result = await Driver.Query(q);

		if (result.IsOk) {
			const rows = result.Unwrap() as unknown[];
			const row = rows.pop() as Ports.Resource.Source;
			if (!row) return Result.Ok(null);
			return Result.Ok(RU.SourceToMiddle(row));
		}

		return result as ErrorResult;
	}

	public async CreateAuthEntity(
		e: Ports.AuthEntity.Middle
	): AsyncResult<Ports.AuthEntity.Middle> {
		const src = AEU.MiddleToSource(e);
		const q = SQL.CREATE_AUTH_ENTITY(src);

		const result = await Driver.Query(q);

		if (result.IsOk) return Result.Ok(e);
		return result as ErrorResult;
	}

	public async FetchAuthEntity(
		id: string
	): AsyncResult<Ports.AuthEntity.Middle> {
		const q = SQL.FETCH_AUTH_ENTITY(id);
		const result = await Driver.Query(q);

		if (result.IsOk) {
			const rows = result.Unwrap() as unknown[];
			const row = rows.pop() as Ports.AuthEntity.Source;
			if (!row) return Result.Ok(null);
			return Result.Ok(AEU.SourceToMiddle(row));
		}

		return result as ErrorResult;
	}
}

export default MariaDBRepository;
