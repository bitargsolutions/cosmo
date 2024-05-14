import { status } from "@grpc/grpc-js";

import { z } from "zod";
import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";
import AuthEntity from "../../../entities/auth_entity.js";

const RequestSchema = z.object({
	id: z.string().startsWith("cosmo:rman:")
});
type GetAuthEntityRequest = z.infer<typeof RequestSchema>;

const GetResource: AsyncShackHandlerFn = async (ctx) => {
	const body = ctx.body as GetAuthEntityRequest;
	const fetchResult = await AuthEntity.Fetch(body.id);

	if (fetchResult.IsErr) {
		return MethodChain.ErrWithCode(status.INTERNAL, fetchResult.AsErr());
	}

	const data = fetchResult.Unwrap();
	return Result.Ok({ data });
};

export default MethodChain.Link(
	GetResource,
	MethodChain.ExtractCredentials(),
	MethodChain.ExtractBody(RequestSchema)
);
