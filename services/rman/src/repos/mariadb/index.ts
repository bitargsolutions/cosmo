import { Result } from "@cosmo/core";

import Repository from "../index.js";
import Driver from "./driver.js";
import * as SQL from "./sql.js";
import {
	ResourceUtilities as RU,
	AuthEntityUtilities as AEU
} from "./utils.js";

type ResourceSource = Ports.Resource.Source.MariaDB;
type AuthEntitySource = Ports.AuthEntity.Source.MariaDB;
type PermissionSource = Ports.Permission.Source.MariaDB;

class MariaDBRepository extends Repository {
	constructor() {
		super();
		Driver.Initialize();
	}

	public async CreateResource(
		r: Ports.Resource.Middle
	): AsyncResult<Ports.Resource.Middle> {
		const src = RU.MiddleToSource(r);
		const q = SQL.CREATE_RESOURCE(src);
		const result = await Driver.Query(q);

		if (result.IsErr) {
			return result.AsErr();
		}

		return Result.Ok(r);
	}

	public async UpdateResource(r: Ports.Resource.Middle) {
		const src = RU.MiddleToSource(r);
		const q = SQL.UPDATE_RESOURCE(src);

		const result = await Driver.Query(q);

		if (result.IsErr) {
			return result.AsErr();
		}

		// TODO: check if updated

		return Result.Ok(true);
	}

	public async FetchResource(
		id: string
	): AsyncResult<Ports.Resource.Middle | null> {
		const q = SQL.FETCH_RESOURCE(id);

		const result = await Driver.Query<ResourceSource[]>(q);

		if (result.IsErr) {
			return result.AsErr();
		}

		const rows = result.Unwrap();
		const row = rows.pop();
		return Result.Ok(!row ? null : RU.SourceToMiddle(row));
	}

	public async CreateAuthEntity(
		e: Ports.AuthEntity.Middle
	): AsyncResult<Ports.AuthEntity.Middle> {
		const src = AEU.MiddleToSource(e);
		const q = SQL.CREATE_AUTH_ENTITY(src);

		const result = await Driver.Query(q);

		if (result.IsErr) {
			return result.AsErr();
		}

		return Result.Ok(e);
	}

	public async FetchAuthEntity(
		id: string
	): AsyncResult<Ports.AuthEntity.Middle | null> {
		const q = SQL.FETCH_AUTH_ENTITY(id);
		const result = await Driver.Query<AuthEntitySource[]>(q);

		if (result.IsErr) {
			return result.AsErr();
		}

		const rows = result.Unwrap();
		const row = rows.pop();

		if (!row) {
			return Result.Ok(null);
		}

		const resourceResult = await this.FetchResource(row.crid);
		if (resourceResult.IsErr) {
			return resourceResult.AsErr();
		}

		const resource = resourceResult.Unwrap();
		if (!resource) {
			return Result.Ok(null);
		}

		const middle = AEU.SourceToMiddle(row, resource);
		return Result.Ok(middle);
	}

	public async CompilePermissions(
		authorId: string,
		resourceId: string
	): AsyncResult<string[]> {
		const q = SQL.FETCH_ENTITY_RESOURCE_PERMISSIONS(authorId, resourceId);
		const fetchResult = await Driver.Query(q);

		if (fetchResult.IsErr) {
			return fetchResult.AsErr();
		}

		const rows = fetchResult.Unwrap() as PermissionSource[];
		return Result.Ok(rows.map((r) => r.permission));
	}

	public async UpdateAuthEntity(
		e: Ports.AuthEntity.Middle
	): AsyncResult<boolean> {
		const src = AEU.MiddleToSource(e);
		const q = SQL.UPDATE_AUTH_ENTITY(src);

		const result = await Driver.Query(q);

		if (result.IsErr) {
			return result.AsErr();
		}

		return Result.Ok(true);
	}
}

export default MariaDBRepository;
