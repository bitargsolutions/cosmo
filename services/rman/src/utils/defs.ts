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

export const ENV_KEYS = Object.freeze([
	"SECRET_KEY",
	"MARIADB_HOST",
	"MARIADB_USER",
	"MARIADB_PASSWORD",
	"MARIADB_DATABASE"
] as const);
export type EnvKey = (typeof ENV_KEYS)[number];
