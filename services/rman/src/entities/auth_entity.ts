import { SERVICE_PREFIX, generateId } from "../utils/index.js";
import Repository from "../repos/index.js";
import { Result } from "@cosmo/core";
import Resource from "./resource.js";
import { makeSecretHash } from "../utils/auth_entity.js";
import Permission from "./permission.js";

class AuthEntity {
	private static repository: Repository;

	public static get PrefixId(): string {
		return SERVICE_PREFIX + ":auth_entity";
	}

	public static Initialize(r: Repository) {
		AuthEntity.repository = r;
	}

	public static async Create(
		authorId: string
	): AsyncResult<Ports.AuthEntity.Middle> {
		// -- Check if entity can create new entities

		const checkResult = await Permission.CanCreateEntity(authorId);
		if (checkResult.IsErr) {
			return checkResult.AsErr();
		}

		// -- Create the new entity resource

		const createResourceResult = await Resource.Create(authorId);

		if (createResourceResult.IsErr) {
			return createResourceResult.AsErr();
		}

		const resource = createResourceResult.Unwrap();

		// -- Create new entity

		const idResult = generateId(AuthEntity.PrefixId);
		if (idResult.IsErr) {
			return idResult.AsErr();
		}

		const secretHashResult = makeSecretHash();
		if (secretHashResult.IsErr) {
			return secretHashResult.AsErr();
		}

		const newEntity: Ports.AuthEntity.Middle = {
			id: idResult.Unwrap(),
			crid: resource.id,
			secretHash: secretHashResult.Unwrap()
		};

		const createEntityResult = await AuthEntity.repository.CreateAuthEntity(
			newEntity
		);
		if (createEntityResult.IsErr) {
			return createEntityResult.AsErr();
		}

		const e = createEntityResult.Unwrap();
		return Result.Ok(e);
	}

	public static async Fetch(
		id: string
	): AsyncResult<Ports.AuthEntity.Middle | null> {
		return AuthEntity.repository.FetchAuthEntity(id);
	}
}

export default AuthEntity;
