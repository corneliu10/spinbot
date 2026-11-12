import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  "window.localHostTitle": "Spinbot Yerel Ana Makine",
  "window.localClientTitle": "Spinbot Yerel İstemci",
  "window.computerUsePermissionTitle": "Bilgisayar Kullanımını aç",
} as const satisfies PartialTranslation<typeof source>;
