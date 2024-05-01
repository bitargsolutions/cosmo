import { SERVICE_PREFIX, generateId, Permissions } from "../utils";
import Repository from "../repos";
import { Result } from "@cosmo/core";

class Permission {
	private static repository: Repository;

	public static get PrefixId(): string {
		return SERVICE_PREFIX + ":auth_entity";
	}

	public static Initialize(r: Repository) {
		Permission.repository = r;
	}

	public static async Check(
		entityId: string,
		resourceId: string,
		permission: string
	): AsyncResult<boolean> {
		return Result.Ok(true);
	}
}

export default Permission;
