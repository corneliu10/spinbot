import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "تم تسجيل Spinbot هذا للوصول عبر WebRTC.",
  "status.host.keyRotated": "تغيّر مفتاح الخادم. تبقى الأجهزة المقترنة مقترنة.",
  "status.host.identityUpdated": "تم تحديث هوية الخادم.",
  "status.host.starting": "جارٍ تشغيل مضيف WebRTC…",
  "status.host.ready": "Spinbot هذا جاهز لاتصالات WebRTC.",
  "status.host.signalLost": "لا يمكن للأجهزة الأخرى الوصول إلى Spinbot هذا الآن. سيتصل مرة أخرى.",
  "status.host.stopping": "جارٍ جعل Spinbot هذا خاصًا…",
  "status.host.private": "Spinbot هذا خاص.",
  "status.host.removed": "أُزيل Spinbot هذا من حسابك. انشره مرة أخرى لمشاركته.",
} as const satisfies PartialTranslation<typeof source>;
