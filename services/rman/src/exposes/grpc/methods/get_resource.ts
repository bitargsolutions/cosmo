import { status } from "@grpc/grpc-js";

import { z } from "zod";
import Resource from "../../../entities/resource.js";
import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";

const RequestSchema = z.object({
	id: z.string().startsWith("cosmo:rman:")
});
type GetResourceRequest = z.infer<typeof RequestSchema>;

const GetResource: AsyncShackHandlerFn = async (ctx) => {
	const body = ctx.body as GetResourceRequest;
	const fetchResult = await Resource.Fetch(body.id);

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
