import { createCapture } from "./capture";

export function setupExpress(capture: ReturnType<typeof createCapture>) {
  try {
    require("express");
  } catch {
    return;
  }

  const express = require("express");
  const originalRouter = express.Router;

  express.Router = function (...args: unknown[]) {
    const router = originalRouter.apply(this, args);
    const originalUse = router.use.bind(router);

    router.use = function (...middlewareArgs: unknown[]) {
      const result = originalUse(...middlewareArgs);

      originalUse(function upstatErrorHandler(
        err: Error,
        req: Record<string, unknown>,
        res: Record<string, unknown>,
        next: (err?: unknown) => void,
      ) {
        capture([err], "express", {
          method: req.method,
          path: req.path,
          statusCode: (res as Record<string, unknown>).statusCode,
        });
        next(err);
      });

      return result;
    };

    return router;
  };
}
