const TRACE_LEVEL = ["trace", "info", "warn", "error"] as const;
type TraceLevel = (typeof TRACE_LEVEL)[number];