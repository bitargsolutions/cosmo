import { status } from "@grpc/grpc-js";

import Resource from "../../../entities/resource.js";
import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";

const CreateResource: AsyncShackHandlerFn = async (ctx) => {
	const creationResult = await Resource.Create(
		ctx.credentials?.entityId ?? "<unknown>"
	);

	if (creationResult.IsErr) {
		return MethodChain.ErrWithCode(status.INTERNAL, creationResult.AsErr());
	}

	const data = creationResult.Unwrap();
	return Result.Ok({ data });
};

export default MethodChain.Link(
	CreateResource,
	MethodChain.ExtractCredentials()
);
