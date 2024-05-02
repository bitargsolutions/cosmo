import ch from "chalk";
import { TraceLevel } from "./types/TraceLevel";

class Logger {
	private static levels: TraceLevel[] = [];

	// If levels is undefined, read from env
	public static Initialize(levels?: TraceLevel[]) {
		const envLevels: TraceLevel[] = [];
		if (!levels) {
			const envStr = process.env.COSMO_LOGGER;
			if (!envStr) return;
			const sp = envStr.split(",");
			sp.forEach((l) => envLevels.push(l.trim() as TraceLevel));
		}

		Logger.levels = levels ?? envLevels;

		Logger.Info("Logger levels:", Logger.levels.join(", "));
	}

	public static Trace(...args: any[]): void {
		if (!Logger.levels.includes("trace")) return;

		const h = ch.gray("[T]");
		console.log(h, ...args);
	}

	public static Info(...args: any[]): void {
		if (!Logger.levels.includes("info")) return;

		const h = ch.blue("[I]");
		console.info(h, ...args);
	}

	public static Warn(...args: any[]): void {
		if (!Logger.levels.includes("warn")) return;

		const h = ch.yellow("[W]");
		console.warn(h, ...args);
	}

	public static Error(...args: any[]): void {
		if (!Logger.levels.includes("error")) return;

		const h = ch.red("[E]");
		console.error(h, ...args);
	}
}

export { ch };
export default Logger;
