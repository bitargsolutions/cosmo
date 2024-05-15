import { status } from "@grpc/grpc-js";

import MethodChain, { AsyncShackHandlerFn } from "../utils/method.js";
import { Result } from "@cosmo/core";
import { z } from "zod";
import { PresentAuthEntity } from "../utils/presentation.js";
import AuthEntity from "../../../entities/auth_entity.js";

const RequestSchema = z.object({
	auth_entity_id: z.string()
});
export type ArchiveAuthEntityRequest = z.infer<typeof RequestSchema>;

const ArchiveAuthEntity: AsyncShackHandlerFn = async (ctx) => {
	const body = ctx.body as ArchiveAuthEntityRequest;
	const credentials = ctx.credentials;
	const archiveResult = await AuthEntity.Archive(
		credentials?.entityId ?? "<unknown>",
		body.auth_entity_id
	);

	if (archiveResult.IsErr) {
		return MethodChain.ErrWithCode(status.INTERNAL, archiveResult.AsErr());
	}

	const data = archiveResult.Unwrap();
	const presentationData = PresentAuthEntity(data);
	return Result.Ok({ archived_auth_entity: presentationData });
};

export default MethodChain.Link(
	ArchiveAuthEntity,
	MethodChain.ExtractCredentials(),
	MethodChain.ExtractBody(RequestSchema)
);
