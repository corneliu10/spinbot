import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Bu Spinbot, WebRTC erişimi için kaydedildi.",
  "status.host.keyRotated": "Sunucu anahtarı değiştirildi. Eşlenmiş cihazlar eşli kalır.",
  "status.host.identityUpdated": "Sunucu kimliği güncellendi.",
  "status.host.starting": "WebRTC ana makinesi başlatılıyor…",
  "status.host.ready": "Bu Spinbot, WebRTC bağlantıları için hazır.",
  "status.host.signalLost": "Diğer cihazlar şu anda bu Spinbot'a ulaşamıyor. Yeniden bağlanıyor.",
  "status.host.stopping": "Bu Spinbot özel yapılıyor…",
  "status.host.private": "Bu Spinbot özel.",
  "status.host.removed": "Bu Spinbot hesabınızdan kaldırıldı. Paylaşmak için yeniden yayımlayın.",
} as const satisfies PartialTranslation<typeof source>;
