export function toMDBDate(d?: Date): string | undefined {
	return d?.toISOString().replace("T", " ").replace("Z", "");
}

export class ResourceUtilities {
	public static MiddleToSource(
		m: Ports.Resource.Middle
	): Ports.Resource.Source.MariaDB {
		return {
			id: m.id,
			creator_id: m.creatorId,
			creation_date: toMDBDate(m.creationDate) as string,
			archive_date: toMDBDate(m.archiveDate),
			archiver_id: m.archiverId
		};
	}

	public static SourceToMiddle(
		s: Ports.Resource.Source.MariaDB
	): Ports.Resource.Middle {
		return {
			id: s.id,
			creatorId: s.creator_id,
			creationDate: new Date(s.creation_date),
			archiveDate: s.archive_date ? new Date(s.archive_date) : undefined,
			archiverId: s?.archiver_id ?? undefined
		};
	}
}

export class AuthEntityUtilities {
	public static MiddleToSource(
		m: Ports.AuthEntity.Middle
	): Ports.AuthEntity.Source.MariaDB {
		return {
			id: m.id,
			crid: m.resource.id,
			secret_hash: m.secretHash
		};
	}

	public static SourceToMiddle(
		s: Ports.AuthEntity.Source.MariaDB,
		resource: Ports.Resource.Middle
	): Ports.AuthEntity.Middle {
		return {
			id: s.id,
			secretHash: s.secret_hash,
			resource
		};
	}
}
