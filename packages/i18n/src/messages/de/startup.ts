import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Spinbot konnte nicht starten",
  "startup.failedBody":
    "{message}\n\nDeine lokalen Daten wurden weder zurückgesetzt noch überschrieben. Schritte zur Wiederherstellung findest du in der Anleitung zur Fehlerbehebung.",
  "startup.archiveChangedTitle": "Spinbot-Dateien wurden geändert",
  "startup.archiveChangedBody":
    "Ein anderes Programm hat die Spinbot-Datei app.asar geändert. Spinbot läuft jetzt, startet aber nicht mehr, wenn du es beendest.\n\nInstalliere Spinbot erneut, um es zu reparieren. Deine lokalen Daten bleiben erhalten.",
  "startup.archiveChangedDownload": "Spinbot laden",
  "startup.newerDataUpdatingTitle": "Spinbot wird aktualisiert",
  "startup.newerDataUpdatingBody":
    "Eine neuere Version von Spinbot hat deine Daten gespeichert. Spinbot installiert die neueste Version und startet dann neu.\n\nDeine lokalen Daten wurden nicht zurückgesetzt oder überschrieben.",
  "startup.newerDataTitle": "Neueste Spinbot-Version installieren",
  "startup.newerDataBody":
    "Eine neuere Version von Spinbot hat deine Daten gespeichert, und diese Version ({version}) kann sie nicht öffnen. Installiere die neueste Version, um deine Daten zu öffnen.\n\nDeine lokalen Daten wurden nicht zurückgesetzt oder überschrieben.",
  "startup.newerDataDownload": "Spinbot laden",
  "startup.newerDataGuide": "Anleitung öffnen",
  "startup.newerDataQuit": "Beenden",
  "startup.recoveryWindowTitle": "Spinbot-Wiederherstellung",
  "startup.recoveryTitle": "Spinbot wurde nicht geöffnet",
  "startup.recoveryBody": {
    one: "Spinbot {version} wurde {count} Mal in Folge vor dem Öffnen beendet. Deine lokalen Daten wurden nicht zurückgesetzt oder überschrieben.",
    other:
      "Spinbot {version} wurde {count} Mal in Folge vor dem Öffnen beendet. Deine lokalen Daten wurden nicht zurückgesetzt oder überschrieben.",
  },
  "startup.recoveryHint":
    "Versuche es erneut oder installiere die letzte Version, die sich geöffnet hat. Für Hilfe exportiere die Diagnosedaten und sende die Datei mit deinem Bericht.",
  "startup.recoveryRetry": "Wiederholen",
  "startup.recoveryPreviousVersion": "Vorherige Version laden",
  "startup.recoveryExportDiagnostics": "Diagnose exportieren",
  "startup.recoveryOpenDataFolder": "Datenordner öffnen",
  "startup.recoveryQuit": "Beenden",
  "startup.recoveryDiagnosticsSaved": "Die Diagnosedatei ist gespeichert.",
  "startup.recoveryActionFailed": "Spinbot konnte diese Aktion nicht ausführen.",
} as const satisfies PartialTranslation<typeof source>;
