import { Result } from "@cosmo/core";

export function FORBIDDEN_ACTION(
	authorId: string,
	resourceId: string,
	permission: string
) {
	return Result.Err({
		code: "forbidden_action",
		message: `The entity cannot perform the action needed`,
		detail: {
			authorId,
			resourceId,
			permission
		}
	});
}

export function UNDEFINED_ENV_KEY(key: string) {
	return Result.Err({
		code: "undefined_env_key",
		message: `${key} must be defined on .env`,
		detail: {
			key
		}
	});
}

export function INTERNAL_ERROR(message?: string) {
	return Result.Err({
		code: "internal_error",
		message: message ?? "An internal error ocurred"
	});
}
