import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Host local de Spinbot",
  "window.localClientTitle": "Cliente local de Spinbot",
  "window.computerUsePermissionTitle": "Activar el uso del equipo",
} as const satisfies PartialTranslation<typeof source>;
