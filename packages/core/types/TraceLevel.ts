const TRACE_LEVEL = ["trace", "info", "warn", "error"] as const;
export type TraceLevel = (typeof TRACE_LEVEL)[number];