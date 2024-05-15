export const Permissions = Object.freeze({
	// -- Resources
	CreateResource: "cosmo:rman:permission:create_resource",
	ShallowReadResource: "cosmo:rman:permission:shallow_read_resource",
	DeepReadResource: "cosmo:rman:permission:deep_read_resource",
	ArchiveResource: "cosmo:rman:permission:archive_resource",

	// -- Auth Entities
	CreateAuthEntity: "cosmo:rman:permission:create_auth_entity",
	UpdateAuthEntity: "cosmo:rman:permission:update_auth_entity",

	// -- Others
	Wildcard: "cosmo:rman:permission:wildcard"
});

export const PrimitiveResources = Object.freeze({
	Service: "cosmo:rman:resource:rman_service"
});

export const PrimitiveEntities = Object.freeze({
	Super: "cosmo:rman:auth_entity:rman_super"
});

export const ReadModes = Object.freeze({
	Shallow: "shallow",
	Deep: "deep"
} as const);
type ReadModeKeys = keyof typeof ReadModes;
export type ReadMode = (typeof ReadModes)[ReadModeKeys];

export const ENV_KEYS = Object.freeze([
	"SECRET_KEY",
	"MARIADB_HOST",
	"MARIADB_USER",
	"MARIADB_PASSWORD",
	"MARIADB_DATABASE"
] as const);
export type EnvKey = (typeof ENV_KEYS)[number];

export const COSMO_CHANNEL = Object.freeze(["cosmo"] as const);
export const COSMO_RESOURCE_TYPE = Object.freeze([
	"permission",
	"auth_entity",
	"service"
] as const);
