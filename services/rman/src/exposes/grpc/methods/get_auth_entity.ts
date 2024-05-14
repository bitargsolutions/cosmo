import { status } from "@grpc/grpc-js";

import { z } from "zod";
import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";
import AuthEntity from "../../../entities/auth_entity.js";
import { PresentAuthEntity } from "../utils/presentation.js";

const RequestSchema = z.object({
	auth_entity_id: z.string().startsWith("cosmo:rman:")
});
type GetAuthEntityRequest = z.infer<typeof RequestSchema>;

const GetAuthEntity: AsyncShackHandlerFn = async (ctx) => {
	const body = ctx.body as GetAuthEntityRequest;
	const fetchResult = await AuthEntity.Fetch(
		ctx.credentials?.entityId ?? "<unknown>",
		body.auth_entity_id
	);

	if (fetchResult.IsErr) {
		return MethodChain.ErrWithCode(status.INTERNAL, fetchResult.AsErr());
	}

	const data = fetchResult.Unwrap();
	if (!data) {
		return Result.Ok(null);
	}

	const presentationData = PresentAuthEntity(data);
	return Result.Ok({ auth_entity: presentationData });
};

export default MethodChain.Link(
	GetAuthEntity,
	MethodChain.ExtractCredentials(),
	MethodChain.ExtractBody(RequestSchema)
);
