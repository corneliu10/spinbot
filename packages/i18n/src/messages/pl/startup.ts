import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Nie udało się uruchomić Spinbot",
  "startup.failedBody":
    "{message}\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane. Kroki przywracania znajdziesz w przewodniku rozwiązywania problemów.",
  "startup.archiveChangedTitle": "Pliki Spinbot zostały zmienione",
  "startup.archiveChangedBody":
    "Inny program zmienił plik app.asar Spinbot. Spinbot działa teraz, ale nie uruchomi się po zamknięciu.\n\nAby naprawić Spinbot, zainstaluj go ponownie. Twoje lokalne dane zostaną zachowane.",
  "startup.archiveChangedDownload": "Pobierz Spinbot",
  "startup.newerDataUpdatingTitle": "Aktualizowanie Spinbot",
  "startup.newerDataUpdatingBody":
    "Nowsza wersja Spinbot zapisała Twoje dane. Spinbot instaluje najnowszą wersję, a potem uruchomi się ponownie.\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane.",
  "startup.newerDataTitle": "Zainstaluj najnowszy Spinbot",
  "startup.newerDataBody":
    "Nowsza wersja Spinbot zapisała Twoje dane, a ta wersja ({version}) nie może ich otworzyć. Zainstaluj najnowszą wersję, aby otworzyć swoje dane.\n\nTwoje lokalne dane nie zostały zresetowane ani nadpisane.",
  "startup.newerDataDownload": "Pobierz Spinbot",
  "startup.newerDataGuide": "Otwórz przewodnik",
  "startup.newerDataQuit": "Zakończ",
  "startup.recoveryWindowTitle": "Odzyskiwanie Spinbot",
  "startup.recoveryTitle": "Spinbot się nie otworzył",
  "startup.recoveryBody": {
    one: "Spinbot {version} zatrzymał się przed otwarciem {count} raz z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    few: "Spinbot {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    many: "Spinbot {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
    other:
      "Spinbot {version} zatrzymał się przed otwarciem {count} razy z rzędu. Twoje lokalne dane nie zostały zresetowane ani nadpisane.",
  },
  "startup.recoveryHint":
    "Spróbuj ponownie albo zainstaluj ostatnią wersję, która się otwierała. Aby uzyskać pomoc, wyeksportuj diagnostykę i wyślij plik ze zgłoszeniem.",
  "startup.recoveryRetry": "Spróbuj ponownie",
  "startup.recoveryPreviousVersion": "Pobierz poprzednią wersję",
  "startup.recoveryExportDiagnostics": "Eksportuj diagnostykę",
  "startup.recoveryOpenDataFolder": "Otwórz folder danych",
  "startup.recoveryQuit": "Zakończ",
  "startup.recoveryDiagnosticsSaved": "Plik diagnostyki został zapisany.",
  "startup.recoveryActionFailed": "Spinbot nie mógł wykonać tej czynności.",
} as const satisfies PartialTranslation<typeof source>;
