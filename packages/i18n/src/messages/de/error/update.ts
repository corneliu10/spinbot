import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/update";

export const messages = {
  "error.update.unsupported": "Aktualisierungen sind in installierten Desktop-Versionen verfügbar.",
  "error.update.notReady": "Es ist keine Aktualisierung zur Installation bereit.",
  "error.update.restartFailed": "Spinbot konnte zur Installation der Aktualisierung nicht neu starten.",
  "error.update.downloadStalled": "Der Download der Aktualisierung reagiert nicht mehr. Versuche es erneut.",
  "error.update.installFailed":
    "Die Aktualisierung konnte nicht installiert werden. Beende und öffne Spinbot erneut und versuche es noch einmal.",
  "error.update.downloadFailed": "Die Aktualisierung konnte nicht heruntergeladen werden. Versuche es erneut.",
  "error.update.checkFailed": "Es konnte nicht nach Aktualisierungen gesucht werden. Versuche es erneut.",
  "error.update.checkStalled": "Die Suche nach Aktualisierungen reagiert nicht mehr. Versuche es erneut.",
  "error.update.checkOffline":
    "Der Aktualisierungsdienst konnte nicht erreicht werden. Prüfe deine Internetverbindung und versuche es erneut.",
  "error.update.checkUnavailable":
    "Der Aktualisierungsdienst hat nicht geantwortet. Spinbot versucht es in einigen Minuten automatisch erneut.",
  "error.update.checkNoRelease":
    "Für diese Plattform wurde keine veröffentlichte Aktualisierung gefunden. Spinbot versucht es in einigen Minuten automatisch erneut.",
  "error.update.managedByNix":
    "Nix installiert Aktualisierungen für diese Kopie von Spinbot. Aktualisiere sie mit Nix.",
  "error.update.managedByHost":
    "Aktualisierungen auf diesem Mac werden vom Host installiert. Die Aktualisierung bleibt bereit, bis die Host-Wartung ausgeführt wird.",
  "error.update.siblingSession":
    "Eine andere Spinbot-Sitzung läuft noch aus dieser Anwendung. Stoppe Spinbot zuerst in allen anderen macOS-Benutzerkonten und installiere die Aktualisierung erneut.",
  "error.update.siblingSessionSameAccount":
    "Ein anderer Spinbot-Prozess läuft noch in diesem Benutzerkonto. Beende ihn und installiere die Aktualisierung erneut.",
  "error.update.siblingCheckFailed":
    "Andere Spinbot-Sitzungen konnten nicht überprüft werden. Versuche es vor der Installation erneut.",
  "error.update.readOnlyLocation":
    "Spinbot kann von diesem Ort aus keine Aktualisierungen installieren. Beende Spinbot. Ziehe Spinbot im Finder in den Ordner „Programme“ (wenn es schon dort ist, ziehe es heraus und wieder hinein). Öffne Spinbot dann und installiere die Aktualisierung erneut.",
  "error.update.remoteDisabled": "Aktualisierungen durch Serveradministratoren sind auf diesem Computer deaktiviert.",
  "error.update.restartStarted": "Spinbot startet bereits zur Installation der Aktualisierung neu.",
  "error.update.alreadyRestarting": "Spinbot startet bereits neu.",
} as const satisfies PartialTranslation<typeof source>;
