import { SERVICE_PREFIX, generateId } from "../utils/index.js";
import Repository from "../repos/index.js";
import { Result } from "@cosmo/core";
import Resource from "./resource.js";
import { makeSecretHash } from "../utils/auth_entity.js";
import Permission from "./permission.js";
import { Permissions, PrimitiveEntities, ReadModes } from "../utils/defs.js";
import { NOT_FOUND } from "../utils/errors.js";
import { measureMemory } from "node:vm";

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
			secretHash: secretHashResult.Unwrap(),
			resource
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
		authorId: string,
		entityId: string
	): AsyncResult<Ports.AuthEntity.Middle | null> {
		const fetchResult = await AuthEntity.repository.FetchAuthEntity(
			entityId
		);

		if (fetchResult.IsErr) {
			return fetchResult.AsErr();
		}

		const entity = fetchResult.Unwrap();
		if (!entity) {
			return Result.Ok(null);
		}

		const checkResult = await Permission.CanReadResource(
			authorId,
			entity.resource.id
		);
		if (checkResult.IsErr) {
			return checkResult.AsErr();
		}

		const readMode = checkResult.Unwrap();
		if (readMode === ReadModes.Shallow) {
			entity.secretHash = "<hidden>";
		}

		return Result.Ok(entity);
	}

	public static async Archive(
		authorId: string,
		entityId: string
	): AsyncResult<Ports.AuthEntity.Middle> {
		// -- Fetch entity

		const fetchResult = await AuthEntity.Fetch(
			PrimitiveEntities.Super,
			entityId
		);
		if (fetchResult.IsErr) {
			return fetchResult.AsErr();
		}

		const entity = fetchResult.Unwrap();
		if (!entity) {
			return NOT_FOUND();
		}

		// -- Check if author can archive the entity

		const checkResult = await Permission.CanArchiveResource(
			authorId,
			entity.resource.id
		);
		if (checkResult.IsErr) {
			return checkResult.AsErr();
		}

		// -- Archive the entity resource

		const archiveResult = await Resource.Archive(
			entity.resource.id,
			authorId
		);
		if (archiveResult.IsErr) {
			return archiveResult.AsErr();
		}
		const newResource = archiveResult.Unwrap();

		entity.resource = newResource;
		return Result.Ok(entity);
	}

	public static async RestoreSecret(
		authorId: string,
		entityId: string
	): AsyncResult<Ports.AuthEntity.Middle> {
		// -- Fetch entity

		const fetchResult = await AuthEntity.Fetch(
			PrimitiveEntities.Super,
			entityId
		);
		if (fetchResult.IsErr) {
			return fetchResult.AsErr();
		}

		const entity = fetchResult.Unwrap();
		if (!entity) {
			return NOT_FOUND();
		}

		// -- Check if author can update the entity

		const checkResult = await Permission.Check(
			authorId,
			entity.resource.id,
			Permissions.UpdateAuthEntity
		);
		if (checkResult.IsErr) {
			return checkResult.AsErr();
		}

		// -- Update secret hash

		const newSecretHash = makeSecretHash();
		if (newSecretHash.IsErr) {
			return newSecretHash.AsErr();
		}

		entity.secretHash = newSecretHash.Unwrap();

		const updateResult = await AuthEntity.repository.UpdateAuthEntity(
			entity
		);
		if (updateResult.IsErr) {
			return updateResult.AsErr();
		}

		return Result.Ok(entity);
	}
}

export default AuthEntity;
