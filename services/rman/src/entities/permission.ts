import { SERVICE_PREFIX } from "../utils/index.js";
import Repository from "../repos/index.js";
import { Result } from "@cosmo/core";
import {
	PrimitiveResources,
	Permissions,
	PrimitivePermissions,
	ReadMode,
	ReadModes,
	PrimitiveEntities
} from "../utils/defs.js";
import { FORBIDDEN_ACTION } from "../utils/errors.js";

class Permission {
	private static repository: Repository;

	public static get PrefixId(): string {
		return SERVICE_PREFIX + ":permission";
	}

	public static Initialize(r: Repository) {
		Permission.repository = r;
	}

	private static async Check(
		authorId: string,
		resourceId: string,
		permission: string
	): AsyncResult<true> {
		if (authorId === PrimitiveEntities.Super) {
			return Result.Ok(true);
		}

		const compilationResult = await Permission.CompilePermissions(
			authorId,
			resourceId
		);

		if (compilationResult.IsErr) {
			return compilationResult.AsErr();
		}

		const oneOf: string[] = [permission, PrimitivePermissions.Wildcard];

		const permissions = compilationResult.Unwrap();
		if (!permissions.some((p) => oneOf.includes(p))) {
			return FORBIDDEN_ACTION(
				authorId,
				PrimitiveResources.Service,
				permission
			);
		}

		return Result.Ok(true);
	}

	public static async CanCreateEntity(authorId: string): AsyncResult<true> {
		return Permission.Check(
			authorId,
			PrimitiveResources.Service,
			Permissions.CreateAuthEntity
		);
	}

	public static async CanReadResource(
		authorId: string,
		resourceId: string
	): AsyncResult<ReadMode> {
		const canReadDeep = await Permission.Check(
			authorId,
			resourceId,
			Permissions.DeepReadResource
		);
		if (canReadDeep.IsOk) {
			return Result.Ok(ReadModes.Deep);
		}

		const canReadShallow = await Permission.Check(
			authorId,
			resourceId,
			Permissions.ShallowReadResource
		);
		if (canReadShallow.IsOk) {
			return Result.Ok(ReadModes.Shallow);
		}

		return canReadShallow.AsErr();
	}

	public static async CompilePermissions(
		authorId: string,
		resourceId: string
	): AsyncResult<string[]> {
		return Permission.repository.CompilePermissions(authorId, resourceId);
	}
}

export default Permission;
