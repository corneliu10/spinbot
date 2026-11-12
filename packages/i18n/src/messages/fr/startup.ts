import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  // The one native error box: the app could not start, so no renderer exists to show it.
  "startup.failedTitle": "Spinbot n’a pas pu démarrer",
  "startup.failedBody":
    "{message}\n\nVos données locales n’ont pas été réinitialisées ni écrasées. Consultez le guide de dépannage pour savoir comment récupérer la situation.",
  "startup.archiveChangedTitle": "Des fichiers d’Spinbot ont été modifiés",
  "startup.archiveChangedBody":
    "Un autre programme a modifié le fichier app.asar d’Spinbot. Spinbot fonctionne maintenant, mais il ne s’ouvrira plus après sa fermeture.\n\nPour le réparer, réinstallez Spinbot. Vos données locales sont conservées.",
  "startup.archiveChangedDownload": "Télécharger Spinbot",
  "startup.newerDataUpdatingTitle": "Mise à jour d’Spinbot",
  "startup.newerDataUpdatingBody":
    "Une version plus récente d’Spinbot a enregistré vos données. Spinbot installe la dernière version, puis se rouvre.\n\nVos données locales n’ont pas été réinitialisées ni écrasées.",
  "startup.newerDataTitle": "Installez la dernière version d’Spinbot",
  "startup.newerDataBody":
    "Une version plus récente d’Spinbot a enregistré vos données, et cette version ({version}) ne peut pas les ouvrir. Installez la dernière version pour ouvrir vos données.\n\nVos données locales n’ont pas été réinitialisées ni écrasées.",
  "startup.newerDataDownload": "Télécharger Spinbot",
  "startup.newerDataGuide": "Ouvrir le guide",
  "startup.newerDataQuit": "Quitter",
  "startup.recoveryWindowTitle": "Récupération d’Spinbot",
  "startup.recoveryTitle": "Spinbot ne s’est pas ouvert",
  "startup.recoveryBody": {
    one: "Spinbot {version} s’est arrêté avant de s’ouvrir, {count} fois de suite. Vos données locales n’ont pas été réinitialisées ni écrasées.",
    other:
      "Spinbot {version} s’est arrêté avant de s’ouvrir, {count} fois de suite. Vos données locales n’ont pas été réinitialisées ni écrasées.",
  },
  "startup.recoveryHint":
    "Réessayez, ou installez la dernière version qui s’est ouverte. Pour obtenir de l’aide, exportez le diagnostic et envoyez le fichier avec votre rapport.",
  "startup.recoveryRetry": "Réessayer",
  "startup.recoveryPreviousVersion": "Télécharger la version précédente",
  "startup.recoveryExportDiagnostics": "Exporter le diagnostic",
  "startup.recoveryOpenDataFolder": "Ouvrir le dossier des données",
  "startup.recoveryQuit": "Quitter",
  "startup.recoveryDiagnosticsSaved": "Le fichier de diagnostic est enregistré.",
  "startup.recoveryActionFailed": "Spinbot n’a pas pu effectuer cette action.",
} as const satisfies PartialTranslation<typeof source>;
