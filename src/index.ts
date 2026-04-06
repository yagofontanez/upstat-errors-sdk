import { createCapture } from "./capture";
import { setupExpress } from "./express";
import { setupListeners } from "./listener";
import { UpStatOptions } from "./types";

export type { UpStatOptions, CapturedEvent } from "./types";

export const UpStat = {
  listen(options: UpStatOptions) {
    if (!options.token) {
      throw new Error("[upstat-js] token é obrigatório");
    }

    const capture = createCapture(options);

    setupListeners(capture, options);
    setupExpress(capture);
  },
};
