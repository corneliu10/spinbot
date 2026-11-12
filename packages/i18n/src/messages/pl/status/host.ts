import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Zarejestrowano ten Spinbot do dostępu przez WebRTC.",
  "status.host.keyRotated": "Zmieniono klucz serwera. Sparowane urządzenia pozostają sparowane.",
  "status.host.identityUpdated": "Zaktualizowano tożsamość serwera.",
  "status.host.starting": "Uruchamianie hosta WebRTC…",
  "status.host.ready": "Ten Spinbot jest gotowy na połączenia WebRTC.",
  "status.host.signalLost": "Inne urządzenia nie mogą teraz połączyć się z tym Spinbotem. Łączy się ponownie.",
  "status.host.stopping": "Ustawianie tego serwera Spinbot jako prywatnego…",
  "status.host.private": "Ten Spinbot jest prywatny.",
  "status.host.removed": "Ten Spinbot został usunięty z Twojego konta. Opublikuj go ponownie, aby go udostępnić.",
} as const satisfies PartialTranslation<typeof source>;
