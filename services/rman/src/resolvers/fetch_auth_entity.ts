import AuthEntity from "../entities/auth_entity";
import { AuthEntityUtilities } from "../repos/mariadb/utils";

interface Args {
	id: string;
}

const fetchAuthEntity: Utils.ResolverFn<
	Ports.AuthEntity.Presentation | null,
	Args
> = async (_, args, ctx) => {
	const author = ctx["entity"] as Ports.AuthEntity.Middle;

	const { id } = args;

	const fetchResult = await AuthEntity.Fetch(id);
	if (fetchResult.IsErr) {
		console.error("fetchAuthEntity: Error while fetching", fetchResult.Err);
		return null;
	}

	const authEntity = fetchResult.Unwrap();
	if (!authEntity) return null;

	const presentation = AuthEntityUtilities.MiddleToPresentation(authEntity);

	if (author.id !== authEntity.id) {
		delete presentation.secretHash;
	}

	return presentation;
};

export default fetchAuthEntity;
