import AuthEntity from "../entities/auth_entity";
import { AuthEntityUtilities } from "../repos/mariadb/utils";

const createAuthEntity: Utils.ResolverFn<
	Ports.AuthEntity.Presentation | null
> = async (_, __, ctx) => {
	const authEntity = ctx["entity"] as Ports.AuthEntity.Middle;
	if (!authEntity) return null;

	const createResult = await AuthEntity.Create(authEntity);
	if (createResult.IsErr) return null;

	const e = createResult.Unwrap();
	return AuthEntityUtilities.MiddleToPresentation(e);
};

export default createAuthEntity;
