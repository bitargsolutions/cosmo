import { SERVICE_PREFIX, generateId } from "../utils/index.js";
import Repository from "../repos/index.js";
import { Result } from "@cosmo/core";

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
		r: Ports.Resource.Middle,
		archiverId: string
	): AsyncResult<Ports.Resource.Middle> {
		r.archiveDate = new Date();
		r.archiverId = archiverId;

		const result = await Resource.repository.UpdateResource(r);
		if (result.IsErr) {
			return result.AsErr();
		}

		return Result.Ok(r);
	}
}

export default Resource;
