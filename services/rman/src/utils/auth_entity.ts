import Crypto from "node:crypto";

import { Result } from "@cosmo/core";
import { getFromEnv } from "./index.js";

export function makeSecretHash(secretKey?: string): SyncResult<string> {
	// -- If secretKey is undefined, get it from env

	let sk = secretKey;
	if (!sk) {
		const ekResult = getFromEnv("SECRET_KEY");
		if (ekResult.IsErr) {
			return ekResult.AsErr();
		}
		sk = ekResult.Unwrap();
	}

	// -- Digestion

	const hash = Crypto.createHash("sha512");
	hash.update(`${Date.now()}::${sk}`);
	const hexHash = hash.digest("hex");

	return Result.Ok(hexHash);
}
