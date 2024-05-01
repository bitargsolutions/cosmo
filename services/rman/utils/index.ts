import { GraphQLResolveInfo } from "graphql";

export const SERVICE_PREFIX = "cosmo:rman";
export const SUPER_ENTITY_ID = "cosmo:super";

export function generateId(prefix: string): string {
	const secret = process.env.SECRET_KEY;
	const hasher = new Bun.CryptoHasher("ripemd160");
	hasher.update(`${Date.now()}::${secret}`);
	const hash = hasher.digest("hex");
	return `${prefix}:${hash}`;
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

export const Permissions = Object.freeze({
	CreateResource: "cosmo:p:create_resource",
	ReadResource: "cosmo:p:read_resource",
	UpdateResource: "cosmo:p:update_resource",
	CreateAuthEntity: "cosmo:rman:permission:create_auth_entity"
});

export const PrimitiveResources = Object.freeze({
	Service: "cosmo:rman:resource:rman"
});

export const PrimitiveEntity = Object.freeze({
	Super: "cosmo:rman:auth_entity:super"
});
