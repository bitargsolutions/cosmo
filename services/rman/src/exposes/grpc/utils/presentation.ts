export function PresentResource(
	r: Ports.Resource.Middle
): Ports.Resource.Presentation.gRPC {
	return {
		id: r.id,
		creator_id: r.creatorId,
		creation_date: r.creationDate.toISOString(),
		archive_date: r.archiveDate?.toISOString(),
		archiver_id: r.archiverId
	};
}

export function PresentAuthEntity(
	e: Ports.AuthEntity.Middle
): Ports.AuthEntity.Presentation.gRPC {
	return {
		id: e.id,
		secret_hash: e.secretHash,
		resource: PresentResource(e.resource)
	};
}
