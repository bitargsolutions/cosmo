import Resource from "../entities/resource";

interface Args {
	id: string;
}

const archiveResource: Utils.ResolverFn<
	Ports.Resource.Presentation | null,
	Args
> = async (_, args) => {
	let fetchResult = await Resource.Fetch(args.id);
	if (!fetchResult.IsOk) {
		console.error("archiveResource: Error while fetching", fetchResult.Err);
		return null;
	}
	const foundedResource = fetchResult.Unwrap();
	if (foundedResource === null) return null;

	const archiveResult = await Resource.Archive(foundedResource, "juan");
	if (!archiveResult.IsOk) {
		console.error(
			"archiveResource: Error while archiving",
			archiveResult.Err
		);
		return null;
	}

	const resource = archiveResult.Unwrap();
	return Resource.Present(resource);
};

export default archiveResource;
