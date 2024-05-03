import Crypto from "node:crypto";
import { Result } from "@cosmo/core";

import type { GraphQLResolveInfo } from "graphql";
import { UNDEFINED_ENV_KEY } from "./errors.js";
import type { EnvKey } from "./defs.js";

export const SERVICE_PREFIX = "cosmo:rman";
export const SUPER_ENTITY_ID = "cosmo:super";

export function generateId(
	prefix: string,
	secretKey?: string
): SyncResult<string> {
	// -- If secretKey is undefined, read it from env

	let sk = secretKey;
	if (!sk) {
		const ekResult = getFromEnv("SECRET_KEY");
		if (ekResult.IsErr) {
			return ekResult.AsErr();
		}
		sk = ekResult.Unwrap();
	}

	// -- Digestion

	const hash = Crypto.createHash("rmd160");
	hash.update(`${Date.now()}::${sk}`);
	const hexHash = hash.digest("hex");

	return Result.Ok(`${prefix}:${hexHash}`);
}

declare global {
	namespace Utils {
		export type ResolverFn<
			R = unknown,
			A = unknown,
			C = Record<string, any>
		> = (p: never, args: A, ctx: C, info: GraphQLResolveInfo) => Promise<R>;
	}
}

export function getFromEnv(key: EnvKey): SyncResult<string> {
	const secretKey = process.env[key];
	if (!secretKey) {
		return UNDEFINED_ENV_KEY(key);
	}

	return Result.Ok(secretKey);
}
