export interface CosmoError<D = unknown> {
	code: string;
	message: string;
	detail?: D;
}