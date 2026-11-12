import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "تعذّر بدء تشغيل Spinbot",
  "startup.failedBody":
    "{message}\n\nلم تُعَد تعيين بياناتك المحلية ولم يُكتب فوقها. راجع دليل استكشاف الأخطاء وإصلاحها لمعرفة خطوات الاسترداد.",
  "startup.archiveChangedTitle": "تم تغيير ملفات Spinbot",
  "startup.archiveChangedBody":
    "غيّر برنامج آخر ملف Spinbot المسمى app.asar. يعمل Spinbot الآن، لكنه لن يفتح بعد إنهائه.\n\nلإصلاح Spinbot، ثبّته من جديد. تبقى بياناتك المحلية.",
  "startup.archiveChangedDownload": "تنزيل Spinbot",
  "startup.newerDataUpdatingTitle": "جارٍ تحديث Spinbot",
  "startup.newerDataUpdatingBody":
    "حفظ إصدار أحدث من Spinbot بياناتك. يثبّت Spinbot أحدث إصدار ثم يفتح مرة أخرى.\n\nلم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
  "startup.newerDataTitle": "ثبّت أحدث إصدار من Spinbot",
  "startup.newerDataBody":
    "حفظ إصدار أحدث من Spinbot بياناتك، ولا يستطيع هذا الإصدار ({version}) فتحها. ثبّت أحدث إصدار لفتح بياناتك.\n\nلم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
  "startup.newerDataDownload": "تنزيل Spinbot",
  "startup.newerDataGuide": "فتح الدليل",
  "startup.newerDataQuit": "إنهاء",
  "startup.recoveryWindowTitle": "استرداد Spinbot",
  "startup.recoveryTitle": "لم يُفتح Spinbot",
  "startup.recoveryBody": {
    zero: "توقف Spinbot {version} قبل أن يُفتح {count} مرة متتالية. لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    one: "توقف Spinbot {version} قبل أن يُفتح مرة واحدة ({count}). لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    two: "توقف Spinbot {version} قبل أن يُفتح مرتين متتاليتين ({count}). لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    few: "توقف Spinbot {version} قبل أن يُفتح {count} مرات متتالية. لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    many: "توقف Spinbot {version} قبل أن يُفتح {count} مرة متتالية. لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    other:
      "توقف Spinbot {version} قبل أن يُفتح {count} مرة متتالية. لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
  },
  "startup.recoveryHint":
    "أعد المحاولة، أو ثبّت آخر إصدار فُتح. للحصول على المساعدة، صدّر بيانات التشخيص وأرسل الملف مع بلاغك.",
  "startup.recoveryRetry": "إعادة المحاولة",
  "startup.recoveryPreviousVersion": "تنزيل الإصدار السابق",
  "startup.recoveryExportDiagnostics": "تصدير التشخيص",
  "startup.recoveryOpenDataFolder": "فتح مجلد البيانات",
  "startup.recoveryQuit": "إنهاء",
  "startup.recoveryDiagnosticsSaved": "تم حفظ ملف التشخيص.",
  "startup.recoveryActionFailed": "تعذّر على Spinbot تنفيذ هذا الإجراء.",
} as const satisfies PartialTranslation<typeof source>;
