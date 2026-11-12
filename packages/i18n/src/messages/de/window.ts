import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Lokaler Spinbot-Host",
  "window.localClientTitle": "Lokaler Spinbot-Client",
  "window.computerUsePermissionTitle": "Computersteuerung aktivieren",
} as const satisfies PartialTranslation<typeof source>;
