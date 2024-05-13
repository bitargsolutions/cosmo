import { Result } from "@cosmo/core";
import { Metadata } from "@grpc/grpc-js";
import AuthEntity from "../../../entities/auth_entity.js";

export interface Credentials {
	entityId: string;
	entitySecretHash: string;
}

class Auth {
	public static GetCredentialsFromMetadata(
		metadata: Metadata
	): SyncResult<Credentials> {
		const authHeader = metadata.get("authorization").at(0);
		if (!authHeader) {
			return Result.Err({
				code: "CredentialsNotFound",
				message: 'The "Authorization" header is empty'
			});
		}

		const authStr = authHeader.toString();
		const authHash = authStr.split(" ").at(-1) ?? "";
		if (authHash === "" || !authStr.startsWith("Basic ")) {
			return Result.Err({
				code: "AuthorizationHeaderMalformed",
				message:
					'The "Authorization" header must follow the Basic standard'
			});
		}

		const buf = Buffer.from(authHash, "base64");
		const str = buf.toString("utf-8")?.split(":");

		const entitySecretHash = str.pop();
		const entityId = str.join(":");

		if (!entityId?.startsWith(AuthEntity.PrefixId)) {
			return Result.Err({
				code: "InvalidAuthEntityID",
				message: "The Auth Entity ID provided is invalid"
			});
		}

		if (entitySecretHash?.length !== 128) {
			return Result.Err({
				code: "InvalidAuthEntitySecretHash",
				message: "The Auth Entity Secret Hash provided is invalid"
			});
		}

		return Result.Ok({
			entityId,
			entitySecretHash
		});
	}
}

export default Auth;
