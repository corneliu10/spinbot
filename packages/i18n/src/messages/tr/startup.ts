import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Spinbot başlatılamadı",
  "startup.failedBody":
    "{message}\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı. Kurtarma adımları için sorun giderme kılavuzuna bakın.",
  "startup.archiveChangedTitle": "Spinbot dosyaları değiştirildi",
  "startup.archiveChangedBody":
    "Başka bir program Spinbot’un app.asar dosyasını değiştirdi. Spinbot şu an çalışıyor, ancak kapattıktan sonra açılmayacak.\n\nOnarmak için Spinbot’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.archiveChangedDownload": "Spinbot’u indir",
  "startup.newerDataUpdatingTitle": "Spinbot güncelleniyor",
  "startup.newerDataUpdatingBody":
    "Spinbot’un daha yeni bir sürümü verilerinizi kaydetti. Spinbot en son sürümü yüklüyor ve ardından yeniden açılacak.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataTitle": "En son Spinbot’u yükleyin",
  "startup.newerDataBody":
    "Spinbot’un daha yeni bir sürümü verilerinizi kaydetti ve bu sürüm ({version}) onları açamıyor. Verilerinizi açmak için en son sürümü yükleyin.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataDownload": "Spinbot’u indir",
  "startup.newerDataGuide": "Kılavuzu aç",
  "startup.newerDataQuit": "Çık",
  "startup.recoveryWindowTitle": "Spinbot kurtarma",
  "startup.recoveryTitle": "Spinbot açılmadı",
  "startup.recoveryBody": {
    one: "Spinbot {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
    other:
      "Spinbot {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  },
  "startup.recoveryHint":
    "Yeniden deneyin veya açılan son sürümü yükleyin. Yardım almak için tanılamayı dışa aktarın ve dosyayı raporunuzla gönderin.",
  "startup.recoveryRetry": "Yeniden dene",
  "startup.recoveryPreviousVersion": "Önceki sürümü indir",
  "startup.recoveryExportDiagnostics": "Tanılamayı dışa aktar",
  "startup.recoveryOpenDataFolder": "Veri klasörünü aç",
  "startup.recoveryQuit": "Çık",
  "startup.recoveryDiagnosticsSaved": "Tanılama dosyası kaydedildi.",
  "startup.recoveryActionFailed": "Spinbot bu işlemi yapamadı.",
} as const satisfies PartialTranslation<typeof source>;
