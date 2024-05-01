import AuthEntity from "../entities/auth_entity";

const createAuthEntity: Utils.ResolverFn<
	Ports.AuthEntity.Presentation | null
> = async (_, __, ctx) => {
	const authEntity = ctx["entity"] as Ports.AuthEntity.Middle;
	if (!authEntity) return null;

	const createResult = await AuthEntity.Create(authEntity);
	if (!createResult.IsOk) return null;

	const e = createResult.Unwrap();
	return AuthEntity.Present(e);
};

export default createAuthEntity;
