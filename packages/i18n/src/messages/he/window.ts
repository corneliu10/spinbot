import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Spinbot מארח מקומי",
  "window.localClientTitle": "Spinbot לקוח מקומי",
  "window.computerUsePermissionTitle": "הפעלת שליטה במחשב",
} as const satisfies PartialTranslation<typeof source>;
