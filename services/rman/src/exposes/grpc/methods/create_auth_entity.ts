import { status } from "@grpc/grpc-js";

import AuthEntity from "../../../entities/auth_entity.js";
import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";

const CreateAuthEntity: AsyncShackHandlerFn = async (ctx) => {
	const creationResult = await AuthEntity.Create(
		ctx.credentials?.entityId ?? "<unknown>"
	);

	if (creationResult.IsErr) {
		return MethodChain.ErrWithCode(status.INTERNAL, creationResult.AsErr());
	}

	const data = creationResult.Unwrap();
	return Result.Ok({ data });
};

export default MethodChain.Link(
	CreateAuthEntity,
	MethodChain.ExtractCredentials()
);
