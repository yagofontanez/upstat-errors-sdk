import { CapturedEvent, UpStatOptions } from "./types";

const DEFAULT_ENDPOINT = "https://api.upstat.online/ingest/errors";

function normalize(args: unknown[]): { message: string; stack?: string } {
  const err = args.find((a) => a instanceof Error) as Error | undefined;

  if (err) {
    const extras = args.filter((a) => a !== err);
    const extraStr = extras.length
      ? " | " + extras.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
      : "";

    return {
      message: err.message + extraStr,
      stack: err.stack,
    };
  }

  return {
    message: args
      .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
      .join(" "),
  };
}

export function createCapture(options: UpStatOptions) {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;

  return async function capture(
    args: unknown[],
    type: CapturedEvent["type"],
    context?: Record<string, unknown>,
  ): Promise<void> {
    const { message, stack } = normalize(args);

    const event: CapturedEvent = {
      token: options.token,
      message,
      stack,
      type,
      environment: options.environment ?? process.env.NODE_ENV ?? "production",
      context,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[upstat-js] falha ao enviar evento:", err);
      }
    }
  };
}
