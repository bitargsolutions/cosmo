import Resource from "../entities/resource";
import { ResourceUtilities as RU } from "../repos/mariadb/utils";

interface Args {
	id: string;
}

const archiveResource: Utils.ResolverFn<
	Ports.Resource.Presentation | null,
	Args
> = async (_, args) => {
	let fetchResult = await Resource.Fetch(args.id);
	if (fetchResult.IsErr) {
		console.error("archiveResource: Error while fetching", fetchResult.Err);
		return null;
	}

	const foundedResource = fetchResult.Unwrap();
	if (foundedResource === null) return null;

	const archiveResult = await Resource.Archive(foundedResource, "juan");
	if (archiveResult.IsErr) {
		console.error(
			"archiveResource: Error while archiving",
			archiveResult.Err
		);
		return null;
	}

	const resource = archiveResult.Unwrap();
	return RU.MiddleToPresentation(resource);
};

export default archiveResource;
