import {
	SERVICE_PREFIX,
	generateId,
	Permissions,
	PrimitiveResources
} from "../utils";
import Repository from "../repos";
import { Result } from "@cosmo/core";
import Resource from "./resource";
import Permission from "./permission";

declare global {
	namespace Ports {
		namespace AuthEntity {
			// Driven-side representation. From/to DB
			export interface Source {
				id: string;
				crid: string;
				secret_hash: string;
			}

			// The agreement between the two
			// This is the one we'll use inside the service
			interface Middle {
				id: string;
				crid: string;
				secretHash: string;
			}

			// Driving-side representation. From/to GraphQL
			interface Presentation {
				id: string;
				crid: string;
				secretHash: string;
			}
		}
	}
}

class AuthEntity {
	private static repository: Repository;

	public static get PrefixId(): string {
		return SERVICE_PREFIX + ":auth_entity";
	}

	public static Initialize(r: Repository) {
		AuthEntity.repository = r;
	}

	public static async Create(
		author: Ports.AuthEntity.Middle
	): AsyncResult<Ports.AuthEntity.Middle> {
		// -- Check if entity can create new entities

		const checkResult = await Permission.Check(
			author.id,
			PrimitiveResources.Service,
			Permissions.CreateAuthEntity
		);

		if (!checkResult.IsOk) return checkResult as ErrorResult;

		const canCreateEntity = checkResult.Unwrap();
		if (!canCreateEntity)
			return Result.Err({
				code: "forbidden_action",
				message: `The entity cannot perform the action needed`,
				detail: {
					authorId: author.id,
					resourceId: PrimitiveResources.Service,
					permission: Permissions.CreateAuthEntity
				}
			});

		// -- Check if entity can create new entities

		const checkRResult = await Permission.Check(
			author.id,
			PrimitiveResources.Service,
			Permissions.CreateResource
		);

		if (!checkRResult.IsOk) return checkRResult as ErrorResult;

		const canCreateResource = checkRResult.Unwrap();
		if (!canCreateResource)
			return Result.Err({
				code: "forbidden_action",
				message: `The entity cannot perform the action needed`,
				detail: {
					entityId: author.id,
					resourceId: PrimitiveResources.Service,
					permission: Permissions.CreateAuthEntity
				}
			});

		// -- Get Secret Key

		const secretKey = process.env.SECRET_KEY;
		if (!secretKey) {
			return Result.Err({
				code: "undefined_secret_key",
				message: "SECRET_KEY must be defined on .env"
			});
		}

		// -- Make Secret Hash

		const hasher = new Bun.CryptoHasher("sha512");
		hasher.update(`${Date.now()}:${secretKey}`);
		const secretHash = hasher.digest("hex");

		// -- Create the new entity resource

		const createResourceResult = await Resource.Create(author.id);

		if (!createResourceResult.IsOk)
			return createResourceResult as ErrorResult;

		const resource = createResourceResult.Unwrap();
		if (!resource)
			return Result.Err({
				code: "could_not_create_resource",
				message: "An internal error ocurred while creating a resource"
			});

		// -- Create new entity

		const newEntity: Ports.AuthEntity.Middle = {
			id: generateId(AuthEntity.PrefixId),
			crid: resource.id,
			secretHash
		};

		const createEntityResult = await AuthEntity.repository.CreateAuthEntity(
			newEntity
		);
		if (!createEntityResult.IsOk) return createEntityResult as ErrorResult;

		const e = createEntityResult.Unwrap();
		return Result.Ok(e);
	}

	public static async Fetch(
		id: string
	): AsyncResult<Ports.AuthEntity.Middle> {
		return AuthEntity.repository.FetchAuthEntity(id);
	}

	public static Present(
		e?: Ports.AuthEntity.Middle | null
	): Ports.AuthEntity.Presentation | null {
		if (!e) return null;

		return {
			id: e.id,
			crid: e.crid,
			secretHash: e.secretHash
		};
	}
}

export default AuthEntity;
