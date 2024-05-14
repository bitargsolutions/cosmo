import { status } from "@grpc/grpc-js";

import AuthEntity from "../../../entities/auth_entity.js";
import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";
import { PresentAuthEntity } from "../utils/presentation.js";

const CreateAuthEntity: AsyncShackHandlerFn = async (ctx) => {
	const creationResult = await AuthEntity.Create(
		ctx.credentials?.entityId ?? "<unknown>"
	);

	if (creationResult.IsErr) {
		const statusCode =
			creationResult.Err.code === "ForbiddenAction"
				? status.PERMISSION_DENIED
				: status.INTERNAL;
		return MethodChain.ErrWithCode(statusCode, creationResult.AsErr());
	}

	const data = creationResult.Unwrap();
	const presentationData = PresentAuthEntity(data);
	return Result.Ok({ created_auth_entity: presentationData });
};

export default MethodChain.Link(
	CreateAuthEntity,
	MethodChain.ExtractCredentials()
);
