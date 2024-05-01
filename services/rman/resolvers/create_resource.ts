import Resource from "../entities/resource";

const createResource: Utils.ResolverFn<
	Ports.Resource.Presentation | null
> = async () => {
	const createResult = await Resource.Create("juan");
	if (!createResult.IsOk) {
		console.error("createResource: Error while creating", createResult.Err);
		return null;
	}

	const resource = createResult.Unwrap();
	return Resource.Present(resource);
};

export default createResource;
