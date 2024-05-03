import { SERVICE_PREFIX } from "../utils/index.js";
import Repository from "../repos/index.js";
import { Result } from "@cosmo/core";
import { PrimitiveResources, Permissions } from "../utils/defs.js";

class Permission {
	// private static _repository: Repository;

	public static get PrefixId(): string {
		return SERVICE_PREFIX + ":auth_entity";
	}

	public static Initialize(_r: Repository) {
		// Permission._repository = r;
	}

	private static async Check(
		_entityId: string,
		_resourceId: string,
		_permission: string
	): AsyncResult<true> {
		return Result.Ok(true);
	}

	public static async CanCreateEntity(authorId: string): AsyncResult<true> {
		return Permission.Check(
			authorId,
			PrimitiveResources.Service,
			Permissions.CreateAuthEntity
		);
	}
}

export default Permission;
