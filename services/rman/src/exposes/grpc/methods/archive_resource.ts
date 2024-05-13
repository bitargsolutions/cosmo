import { status } from "@grpc/grpc-js";

import Resource from "../../../entities/resource.js";
import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";
import { z } from "zod";

const RequestSchema = z.object({
	id: z.string()
});
export type ArchiveResourceRequest = z.infer<typeof RequestSchema>;

const ArchiveResource: AsyncShackHandlerFn = async (ctx) => {
	const body = ctx.body as ArchiveResourceRequest;
	const credentials = ctx.credentials;
	const archiveResult = await Resource.Archive(
		body.id,
		credentials?.entityId ?? "<unknown>"
	);

	if (archiveResult.IsErr) {
		return MethodChain.ErrWithCode(status.INTERNAL, archiveResult.AsErr());
	}

	const data = archiveResult.Unwrap();
	return Result.Ok({ data });
};

export default MethodChain.Link(
	ArchiveResource,
	MethodChain.ExtractCredentials(),
	MethodChain.ExtractBody(RequestSchema)
);
