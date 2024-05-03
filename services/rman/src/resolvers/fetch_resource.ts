import Resource from "../entities/resource";
import { ResourceUtilities } from "../repos/mariadb/utils";

interface Args {
	id: string;
}

const fetchResource: Utils.ResolverFn<
	Ports.Resource.Presentation | null,
	Args
> = async (_, args) => {
	const { id } = args;

	const fetchResult = await Resource.Fetch(id);
	if (fetchResult.IsErr) {
		console.error("fetchResource: Error while fetching", fetchResult.Err);
		return null;
	}

	const resource = fetchResult.Unwrap();
	return !resource ? null : ResourceUtilities.MiddleToPresentation(resource);
};

export default fetchResource;
