import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import Auth from "../utils/auth.js";
import GRPCError from "../utils/error.js";

import { z } from "zod";
import Resource from "../../../entities/resource.js";

const RequestSchema = z.object({
	id: z.string().startsWith("cosmo:rman:")
});
type GetResourceRequest = z.infer<typeof RequestSchema>;

async function GetResource(
	call: ServerUnaryCall<any, any>,
	cb: sendUnaryData<any>
) {
	const credentialsResult = Auth.GetCredentialsFromMetadata(call.metadata);

	if (credentialsResult.IsErr) {
		cb(GRPCError.AsPermissionDenied(credentialsResult.Err));
		return;
	}

	const reqValidation = RequestSchema.safeParse(call.request);

	if (!reqValidation.success) {
		cb({
			code: status.INVALID_ARGUMENT
		});
		return;
	}

	const credentials = credentialsResult.Unwrap();
	const req = reqValidation.data as GetResourceRequest;

	const fetchResult = await Resource.Fetch(req.id);

	if (fetchResult.IsOk) {
		return cb(null, {
			data: fetchResult.Unwrap()
		});
	}

	console.log(
		`Entity (${credentials.entityId}) tried to fetch Resource (${req.id})`
	);

	// return cb(null, {
	// 	id: "holaaa",
	// 	creationDate: "",
	// 	creatorId: "",
	// 	archiveDate: "",
	// 	archiverId: ""
	// } as Ports.Resource.Presentation);
}

export default GetResource;
