import { status } from "@grpc/grpc-js";

import { z } from "zod";
import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";
import AuthEntity from "../../../entities/auth_entity.js";

const RequestSchema = z.object({
	auth_entity_id: z.string().startsWith("cosmo:rman:")
});
type RestoreAuthEntitySecretRequest = z.infer<typeof RequestSchema>;

const RestoreAuthEntitySecret: AsyncShackHandlerFn = async (ctx) => {
	const body = ctx.body as RestoreAuthEntitySecretRequest;

	const restoreResult = await AuthEntity.RestoreSecret(
		ctx.credentials?.entityId ?? "<unknown>",
		body.auth_entity_id
	);

	if (restoreResult.IsErr) {
		return MethodChain.ErrWithCode(status.INTERNAL, restoreResult.AsErr());
	}

	const data = restoreResult.Unwrap();
	return Result.Ok({ new_secret_hash: data.secretHash });
};

export default MethodChain.Link(
	RestoreAuthEntitySecret,
	MethodChain.ExtractCredentials(),
	MethodChain.ExtractBody(RequestSchema)
);
