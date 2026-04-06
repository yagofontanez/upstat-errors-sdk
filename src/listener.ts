import { createCapture } from "./capture";
import { UpStatOptions } from "./types";

export function setupListeners(
  capture: ReturnType<typeof createCapture>,
  options: UpStatOptions,
) {
  const captureLogs = options.captureLogs ?? ["error", "warn"];

  if (captureLogs.includes("error")) {
    const original = console.error;
    console.error = (...args: unknown[]) => {
      original(...args);
      void capture(args, "console.error");
    };
  }

  if (captureLogs.includes("warn")) {
    const original = console.warn;
    console.warn = (...args: unknown[]) => {
      original(...args);
      void capture(args, "console.warn");
    };
  }

  if (captureLogs.includes("log")) {
    const original = console.log;
    console.log = (...args: unknown[]) => {
      original(...args);
      void capture(args, "console.log");
    };
  }

  process.on("uncaughtException", (err) => {
    capture([err], "uncaughtException").finally(() => {
      process.exit(1);
    });
  });

  process.on("unhandledRejection", (reason) => {
    void capture(
      [reason instanceof Error ? reason : new Error(String(reason))],
      "unhandledRejection",
    );
  });
}
