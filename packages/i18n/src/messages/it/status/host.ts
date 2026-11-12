import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Questo Spinbot è stato registrato per l'accesso WebRTC.",
  "status.host.keyRotated": "Chiave del server cambiata. I dispositivi associati restano associati.",
  "status.host.identityUpdated": "Identità del server aggiornata.",
  "status.host.starting": "Avvio dell'host WebRTC…",
  "status.host.ready": "Questo Spinbot è pronto per le connessioni WebRTC.",
  "status.host.signalLost": "Gli altri dispositivi non possono raggiungere questo Spinbot ora. Si ricollega.",
  "status.host.stopping": "Questo Spinbot sta diventando privato…",
  "status.host.private": "Questo Spinbot è privato.",
  "status.host.removed": "Questo Spinbot è stato rimosso dal tuo account. Pubblicalo di nuovo per condividerlo.",
} as const satisfies PartialTranslation<typeof source>;
