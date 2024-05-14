import { SERVICE_PREFIX, generateId } from "../utils/index.js";
import Repository from "../repos/index.js";
import { Result } from "@cosmo/core";

export interface CRID {
	channel: "cosmo";
	service: string;
	resourceType: string;
	hash: string;
}

class Resource {
	private static repository: Repository;

	public static get PrefixId(): string {
		return SERVICE_PREFIX + ":resource";
	}

	public static Initialize(r: Repository) {
		Resource.repository = r;
	}

	public static async Create(
		creatorId: string
	): AsyncResult<Ports.Resource.Middle> {
		// MAYBE: a permission to create resources?
		//        implement here if so

		const idResult = generateId(Resource.PrefixId);
		if (idResult.IsErr) {
			return idResult.AsErr();
		}

		const r: Ports.Resource.Middle = {
			id: idResult.Unwrap(),
			creatorId,
			creationDate: new Date()
		};

		return Resource.repository.CreateResource(r);
	}

	public static async Fetch(
		id: string
	): AsyncResult<Ports.Resource.Middle | null> {
		return Resource.repository.FetchResource(id);
	}

	public static async Archive(
		resourceId: string,
		archiverId: string
	): AsyncResult<Ports.Resource.Middle> {
		const fetchResult = await Resource.Fetch(resourceId);
		if (fetchResult.IsErr) {
			return fetchResult.AsErr();
		}

		const resource = fetchResult.Unwrap();
		if (!resource) {
			return Result.Err({
				code: "ResourceNotFound",
				message: "Trying to archive an unexistent resource"
			});
		}

		resource.archiveDate = new Date();
		resource.archiverId = archiverId;

		const result = await Resource.repository.UpdateResource(resource);
		if (result.IsErr) {
			return result.AsErr();
		}

		return Result.Ok(resource);
	}
}

export default Resource;
