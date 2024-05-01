import { CosmoError } from "./exceptions/CosmoError";

class Result<T = unknown, E = CosmoError | null> {
	constructor(private ok: T | null, private err: E) {}

	public get Err() {
		return this.err;
	}

	public get IsOk() {
		return this.ok === null;
	}

	public Unwrap(): T | null {
		return this.IsOk ? this.ok : null;
	}

	public static Ok<O = unknown>(v: O): Result<O> {
		return new Result(v, null);
	}

	public static Err(e: CosmoError): Result<null> {
		return new Result(null, e);
	}
}

declare global {
	export type AsyncResult<T> = Promise<Result<T | null>>;
	export type SyncResult<T> = Result<T | null>;
	export type ErrorResult = Result<null>;
}

export default Result;
