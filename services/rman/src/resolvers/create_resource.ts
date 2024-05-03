import Resource from "../entities/resource";
import { ResourceUtilities } from "../repos/mariadb/utils";

const createResource: Utils.ResolverFn<
	Ports.Resource.Presentation | null
> = async (_, __, ctx) => {
	const authEntity = ctx["entity"] as Ports.AuthEntity.Middle;
	if (!authEntity) return null;

	const createResult = await Resource.Create(authEntity.id);
	if (!createResult.IsOk) {
		console.error("createResource: Error while creating", createResult.Err);
		return null;
	}

	const resource = createResult.Unwrap();
	return ResourceUtilities.MiddleToPresentation(resource);
};

export default createResource;
