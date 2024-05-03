export function toMDBDate(d?: Date): string | undefined {
	return d?.toISOString().replace("T", " ").replace("Z", "");
}

export class ResourceUtilities {
	public static MiddleToSource(
		m: Ports.Resource.Middle
	): Ports.Resource.Source {
		return {
			id: m.id,
			creator_id: m.creatorId,
			creation_date: toMDBDate(m.creationDate) as string,
			archive_date: toMDBDate(m.archiveDate),
			archiver_id: m.archiverId,
			modification_date: toMDBDate(m.modificationDate)
		};
	}

	public static SourceToMiddle(
		s: Ports.Resource.Source
	): Ports.Resource.Middle {
		return {
			id: s.id,
			creatorId: s.creator_id,
			creationDate: new Date(s.creation_date),
			archiveDate: s.archive_date ? new Date(s.archive_date) : undefined,
			modificationDate: s.modification_date
				? new Date(s.modification_date)
				: undefined,
			archiverId: s?.archiver_id ?? undefined
		};
	}

	public static MiddleToPresentation(
		r: Ports.Resource.Middle
	): Ports.Resource.Presentation {
		return {
			id: r.id,
			creationDate: r.creationDate.toISOString(),
			creatorId: r.creatorId,
			archiveDate: r.archiveDate?.toISOString(),
			archiverId: r.archiverId,
			modificationDate: r.modificationDate?.toISOString()
		};
	}
}

export class AuthEntityUtilities {
	public static MiddleToSource(
		m: Ports.AuthEntity.Middle
	): Ports.AuthEntity.Source {
		return {
			id: m.id,
			crid: m.crid,
			secret_hash: m.secretHash
		};
	}

	public static SourceToMiddle(
		s: Ports.AuthEntity.Source
	): Ports.AuthEntity.Middle {
		return {
			id: s.id,
			crid: s.crid,
			secretHash: s.secret_hash
		};
	}

	public static MiddleToPresentation(
		e: Ports.AuthEntity.Middle
	): Ports.AuthEntity.Presentation {
		return {
			id: e.id,
			crid: e.crid,
			secretHash: e.secretHash
		};
	}
}
