import Resource from "../entities/resource";

interface Args {
	id: string;
}

const fetchResource: Utils.ResolverFn<
	Ports.Resource.Presentation | null,
	Args
> = async (_, args) => {
	const { id } = args;

	const fetchResult = await Resource.Fetch(id);

	if (!fetchResult.IsOk) {
		console.error("fetchResource: Error while fetching", fetchResult.Err);
		return null;
	}

	const resource = fetchResult.Unwrap();
	return Resource.Present(resource);
};

export default fetchResource;
