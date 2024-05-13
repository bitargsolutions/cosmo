import { CosmoError } from "@cosmo/core";
import { ServerErrorResponse, status } from "@grpc/grpc-js";

class GRPCError {
	public static AsInternal(e: CosmoError<unknown>): ServerErrorResponse {
		return {
			code: status.INTERNAL,
			message: e.message,
			name: e.code
		};
	}

	public static AsPermissionDenied(
		e: CosmoError<unknown>
	): ServerErrorResponse {
		return {
			code: status.PERMISSION_DENIED,
			message: e.message,
			name: e.code
		};
	}
}

export default GRPCError;
