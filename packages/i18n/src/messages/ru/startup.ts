import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Spinbot не удалось запустить",
  "startup.failedBody":
    "{message}\n\nЛокальные данные не сброшены и не перезаписаны. Шаги восстановления — в руководстве по устранению неполадок.",
  "startup.archiveChangedTitle": "Файлы Spinbot изменены",
  "startup.archiveChangedBody":
    "Другая программа изменила файл Spinbot app.asar. Сейчас Spinbot работает, но после выхода он больше не запустится.\n\nЧтобы исправить это, установите Spinbot заново. Ваши локальные данные сохранятся.",
  "startup.archiveChangedDownload": "Скачать Spinbot",
  "startup.newerDataUpdatingTitle": "Обновление Spinbot",
  "startup.newerDataUpdatingBody":
    "Более новая версия Spinbot сохранила ваши данные. Spinbot устанавливает последнюю версию и затем откроется снова.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataTitle": "Установите последнюю версию Spinbot",
  "startup.newerDataBody":
    "Более новая версия Spinbot сохранила ваши данные, и эта версия ({version}) не может их открыть. Установите последнюю версию, чтобы открыть данные.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataDownload": "Скачать Spinbot",
  "startup.newerDataGuide": "Открыть руководство",
  "startup.newerDataQuit": "Выйти",
  "startup.recoveryWindowTitle": "Восстановление Spinbot",
  "startup.recoveryTitle": "Spinbot не открылся",
  "startup.recoveryBody": {
    one: "Spinbot {version} остановился до открытия {count} раз подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    few: "Spinbot {version} остановился до открытия {count} раза подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    many: "Spinbot {version} остановился до открытия {count} раз подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    other:
      "Spinbot {version} остановился до открытия {count} раза подряд. Ваши локальные данные не сброшены и не перезаписаны.",
  },
  "startup.recoveryHint":
    "Попробуйте снова или установите последнюю версию, которая открывалась. Чтобы получить помощь, экспортируйте диагностику и отправьте файл вместе с отчётом.",
  "startup.recoveryRetry": "Повторить",
  "startup.recoveryPreviousVersion": "Скачать прошлую версию",
  "startup.recoveryExportDiagnostics": "Экспорт диагностики",
  "startup.recoveryOpenDataFolder": "Открыть папку данных",
  "startup.recoveryQuit": "Выйти",
  "startup.recoveryDiagnosticsSaved": "Файл диагностики сохранён.",
  "startup.recoveryActionFailed": "Spinbot не удалось выполнить это действие.",
} as const satisfies PartialTranslation<typeof source>;
