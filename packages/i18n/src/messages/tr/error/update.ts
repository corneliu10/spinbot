import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/update";

export const messages = {
  // Kullanıcının okuduğu güncelleyici durumu.
  "error.update.unsupported": "Güncellemeler yüklü masaüstü derlemelerinde kullanılabilir.",
  "error.update.notReady": "Bir güncelleme yüklenmeye hazır değil.",
  "error.update.restartFailed": "Spinbot güncellemeyi yüklemek için yeniden başlatılamadı.",
  "error.update.downloadStalled": "Güncelleme indirmesi yanıt vermeyi durdurdu. Tekrar deneyin.",
  "error.update.installFailed": "Güncelleme yüklenemedi. Spinbot'tan çıkıp yeniden açın, ardından tekrar deneyin.",
  "error.update.downloadFailed": "Güncelleme indirilemedi. Tekrar deneyin.",
  "error.update.checkFailed": "Güncellemeler denetlenemedi. Tekrar deneyin.",
  "error.update.checkStalled": "Güncelleme denetimi yanıt vermeyi durdurdu. Tekrar deneyin.",
  "error.update.checkOffline":
    "Güncelleme hizmetine ulaşılamadı. İnternet bağlantınızı kontrol edin, ardından tekrar deneyin.",
  "error.update.checkUnavailable":
    "Güncelleme hizmeti yanıt vermedi. Spinbot birkaç dakika içinde kendiliğinden tekrar dener.",
  "error.update.checkNoRelease":
    "Bu platform için yayımlanmış bir güncelleme bulunamadı. Spinbot birkaç dakika içinde kendiliğinden tekrar dener.",
  "error.update.managedByNix": "Bu Spinbot kopyasının güncellemelerini Nix yükler. Nix ile güncelleyin.",
  "error.update.managedByHost":
    "Bu Mac üzerindeki güncellemeler ana makine tarafından yüklenir. Güncelleme, ana makinenin bakımı çalışana kadar hazır kalır.",
  "error.update.siblingSession":
    "Bu uygulamadan çalışan başka bir Spinbot oturumu var. Önce diğer tüm macOS kullanıcı hesaplarında Spinbot'u durdurun, ardından güncellemeyi tekrar yükleyin.",
  "error.update.siblingSessionSameAccount":
    "Bu kullanıcı hesabında başka bir Spinbot işlemi hâlâ çalışıyor. Bu işlemi kapatın, ardından güncellemeyi tekrar yükleyin.",
  "error.update.siblingCheckFailed": "Diğer Spinbot oturumları doğrulanamadı. Yüklemeden önce tekrar deneyin.",
  "error.update.readOnlyLocation":
    "Spinbot bu konumdan güncelleme yükleyemez. Spinbot'tan çıkın. Finder'da Spinbot'u Uygulamalar klasörüne sürükleyin (zaten oradaysa dışarı sürükleyip geri koyun). Ardından Spinbot'u açın ve güncellemeyi yeniden yükleyin.",
  // Katılınan bir sunucunun yöneticisi bunları ana makineden okur.
  "error.update.remoteDisabled": "Sunucu yöneticilerinden gelen güncellemeler bu bilgisayarda kapalı.",
  "error.update.restartStarted": "Spinbot, güncellemeyi yüklemek için zaten yeniden başlatılıyor.",
  "error.update.alreadyRestarting": "Spinbot zaten yeniden başlatılıyor.",
} as const satisfies PartialTranslation<typeof source>;
