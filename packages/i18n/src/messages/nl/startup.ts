import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Spinbot kan niet starten",
  "startup.failedBody":
    "{message}\n\nJe lokale gegevens zijn niet gereset of overschreven. Bekijk de handleiding voor probleemoplossing voor herstelstappen.",
  "startup.archiveChangedTitle": "Spinbot-bestanden zijn gewijzigd",
  "startup.archiveChangedBody":
    "Een ander programma heeft het Spinbot-bestand app.asar gewijzigd. Spinbot werkt nu, maar opent niet meer nadat je het afsluit.\n\nInstalleer Spinbot opnieuw om het te herstellen. Je lokale gegevens blijven bewaard.",
  "startup.archiveChangedDownload": "Spinbot downloaden",
  "startup.newerDataUpdatingTitle": "Spinbot wordt bijgewerkt",
  "startup.newerDataUpdatingBody":
    "Een nieuwere versie van Spinbot heeft je gegevens opgeslagen. Spinbot installeert de nieuwste versie en opent daarna opnieuw.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataTitle": "Installeer de nieuwste Spinbot",
  "startup.newerDataBody":
    "Een nieuwere versie van Spinbot heeft je gegevens opgeslagen, en deze versie ({version}) kan ze niet openen. Installeer de nieuwste versie om je gegevens te openen.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataDownload": "Spinbot downloaden",
  "startup.newerDataGuide": "Gids openen",
  "startup.newerDataQuit": "Stoppen",
  "startup.recoveryWindowTitle": "Spinbot-herstel",
  "startup.recoveryTitle": "Spinbot is niet geopend",
  "startup.recoveryBody": {
    one: "Spinbot {version} stopte voordat het openging, {count} keer achter elkaar. Je lokale gegevens zijn niet gewist of overschreven.",
    other:
      "Spinbot {version} stopte voordat het openging, {count} keer achter elkaar. Je lokale gegevens zijn niet gewist of overschreven.",
  },
  "startup.recoveryHint":
    "Probeer het opnieuw, of installeer de laatste versie die wel opende. Exporteer voor hulp de diagnose en stuur het bestand mee met je melding.",
  "startup.recoveryRetry": "Opnieuw",
  "startup.recoveryPreviousVersion": "Vorige versie downloaden",
  "startup.recoveryExportDiagnostics": "Diagnose exporteren",
  "startup.recoveryOpenDataFolder": "Gegevensmap openen",
  "startup.recoveryQuit": "Stoppen",
  "startup.recoveryDiagnosticsSaved": "Het diagnosebestand is opgeslagen.",
  "startup.recoveryActionFailed": "Spinbot kon deze actie niet uitvoeren.",
} as const satisfies PartialTranslation<typeof source>;
