export interface CosmoError<D = unknown> {
	code: string;
	message: string;
	detail?: D;
}

let NEVER: never;
try {
	NEVER = (() => {
		throw new Error();
	})();
} catch (e) {}
export { NEVER };

class Result<T = unknown | never, E = CosmoError | never> {
	constructor(private success: boolean, private ok: T, private err: E) {}

	public get Err() {
		return this.err;
	}

	public get IsErr() {
		return !this.success;
	}

	public get IsOk() {
		return this.success;
	}

	public Unwrap(): T {
		return this.ok;
	}

	public AsErr(): ErrorResult {
		this.ok = NEVER;
		return this as unknown as ErrorResult;
	}

	public static Ok<O = unknown>(v: O): Result<O> {
		return new Result(true, v, NEVER);
	}

	public static Err(e: CosmoError): ErrorResult {
		return new Result(false, NEVER, e);
	}
}

declare global {
	export type AsyncResult<T> = Promise<Result<T | never>>;
	export type SyncResult<T> = Result<T | never>;
	export type ErrorResult = Result<never>;
}

export default Result;
