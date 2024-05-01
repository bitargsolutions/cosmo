import { SERVICE_PREFIX, generateId } from "../utils";
import Repository from "../repos";
import { Result } from "@cosmo/core";

declare global {
	namespace Ports {
		namespace Resource {
			// Driven-side representation. From/to DB
			export interface Source {
				id: string;
				creator_id: string;
				creation_date: string;
				modification_date?: string;
				archive_date?: string;
				archiver_id?: string;
			}

			// The agreement between the two
			// This is the one we'll use inside the service
			interface Middle {
				id: string;
				creatorId: string;
				creationDate: Date;
				modificationDate?: Date;
				archiveDate?: Date;
				archiverId?: string;
			}

			// Driving-side representation. From/to GraphQL
			interface Presentation {
				id: string;
				creatorId: string;
				creationDate: string;
				modificationDate?: string;
				archiveDate?: string;
				archiverId?: string;
			}
		}
	}
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
		const r: Ports.Resource.Middle = {
			id: generateId(Resource.PrefixId),
			creatorId,
			creationDate: new Date()
		};
		return Resource.repository.CreateResource(r);
	}

	public static async Archive(
		r: Ports.Resource.Middle,
		archiverId: string
	): AsyncResult<Ports.Resource.Middle> {
		r.archiveDate = new Date();
		r.archiverId = archiverId;

		const result = await Resource.repository.UpdateResource(r);
		if (!result.IsOk) return result as ErrorResult;

		return Result.Ok(r);
	}

	public static async Fetch(id: string): AsyncResult<Ports.Resource.Middle> {
		return Resource.repository.FetchResource(id);
	}

	public static Present(
		m?: Ports.Resource.Middle | null
	): Ports.Resource.Presentation | null {
		if (!m) return null;

		return {
			id: m.id,
			creationDate: m.creationDate.toISOString(),
			creatorId: m.creatorId,
			archiveDate: m.archiveDate?.toISOString(),
			archiverId: m.archiverId,
			modificationDate: m.modificationDate?.toISOString()
		};
	}
}

export default Resource;
