export interface UpStatOptions {
  token: string;
  environment?: string;
  captureLogs?: Array<"error" | "warn" | "log">;
  endpoint?: string;
}

export interface CapturedEvent {
  token: string;
  message: string;
  stack?: string;
  type:
    | "uncaughtException"
    | "unhandledRejection"
    | "console.error"
    | "console.warn"
    | "console.log"
    | "express";
  environment: string;
  context?: Record<string, unknown>;
  timestamp: string;
}
