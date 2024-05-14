import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import Auth, { Credentials } from "./auth.js";
import { CosmoError, Result } from "@cosmo/core";
import AuthEntity from "../../../entities/auth_entity.js";
import { ZodTypeAny } from "zod";
import { PrimitiveEntities } from "../../../utils/defs.js";

export interface ChainContext {
	call: ServerUnaryCall<unknown, unknown>;
	credentials?: Credentials;
	body?: unknown;
}

export type AsyncShackleFn = (ctx: ChainContext) => AsyncResult<ChainContext>;
export type AsyncShackHandlerFn = (ctx: ChainContext) => AsyncResult<unknown>;

export type LastShackleFn = (
	ctx: ServerUnaryCall<unknown, unknown>,
	cb: sendUnaryData<unknown>
) => Promise<void>;

class MethodChain {
	public static Link(
		handler: AsyncShackHandlerFn,
		...fns: AsyncShackleFn[]
	): LastShackleFn {
		return async (call, cb) => {
			let ctx: ChainContext = { call };
			for (const f of fns) {
				const result = await f(ctx);
				if (result.IsErr) {
					const err = result.Err as CosmoError<any>;
					cb({
						code: err.detail?.grpcStatus ?? status.UNKNOWN,
						message: err.message,
						name: err.code
					});
					return;
				}
				ctx = result.Unwrap();
			}

			const result = await handler(ctx);
			if (result.IsErr) {
				const err = result.Err as CosmoError<any>;
				cb({
					code: err.detail?.grpcStatus ?? status.UNKNOWN,
					message: err.message,
					name: err.code
				});
				return;
			}

			cb(null, result.Unwrap());
			return;
		};
	}

	public static ExtractCredentials(shallow?: boolean): AsyncShackleFn {
		return async function (ctx: ChainContext) {
			const credentialsResult = Auth.GetCredentialsFromMetadata(
				ctx.call.metadata
			);

			if (credentialsResult.IsErr) {
				return credentialsResult.AsErr();
			}

			ctx.credentials = credentialsResult.Unwrap();
			if (shallow) {
				return Result.Ok(ctx);
			}

			const fetchResult = await AuthEntity.Fetch(
				PrimitiveEntities.Super,
				ctx.credentials.entityId
			);

			if (fetchResult.IsErr) {
				return fetchResult.AsErr();
			}

			const entity = fetchResult.Unwrap();
			if (!entity) {
				return Result.Err({
					code: "EntityNotFound",
					message: `Entity with ID "${ctx.credentials.entityId}" not found`
				});
			}

			if (entity.secretHash !== ctx.credentials.entitySecretHash) {
				return Result.Err({
					code: "IncorrectAuthEntitySecretHash",
					message: "The Secret Hash provided is incorrect"
				});
			}

			return Result.Ok(ctx);
		};
	}

	public static ExtractBody(schema: ZodTypeAny): AsyncShackleFn {
		return async function (ctx) {
			const reqValidation = schema.safeParse(ctx.call.request);
			if (!reqValidation.success) {
				return MethodChain.ErrWithCode(
					status.INVALID_ARGUMENT,
					Result.Err({
						code: "InvalidMessageInput",
						message: "The message validation failed"
					})
				);
			}
			ctx.body = reqValidation.data;
			return Result.Ok(ctx);
		};
	}

	public static ErrWithCode(code: status, result: ErrorResult): ErrorResult {
		result.Err.detail = { grpcStatus: code };
		return result;
	}
}

export default MethodChain;
