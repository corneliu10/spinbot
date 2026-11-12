import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Spinbot לא הצליח להיפתח",
  "startup.failedBody":
    "{message}\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו. בצעדי השחזור שבמדריך לפתרון בעיות אפשר לקרוא איך להמשיך.",
  "startup.archiveChangedTitle": "קובצי Spinbot שונו",
  "startup.archiveChangedBody":
    "תוכנה אחרת שינתה את קובץ Spinbot app.asar. Spinbot פועל כעת, אך לא ייפתח לאחר היציאה ממנו.\n\nכדי לתקן את Spinbot, יש להתקין אותו מחדש. הנתונים המקומיים נשמרים.",
  "startup.archiveChangedDownload": "הורדת Spinbot",
  "startup.newerDataUpdatingTitle": "Spinbot מתעדכן",
  "startup.newerDataUpdatingBody":
    "גרסה חדשה יותר של Spinbot שמרה את הנתונים שלך. Spinbot מתקין את הגרסה האחרונה ואז נפתח מחדש.\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  "startup.newerDataTitle": "התקנת Spinbot העדכני ביותר",
  "startup.newerDataBody":
    "גרסה חדשה יותר של Spinbot שמרה את הנתונים שלך, והגרסה הזו ({version}) אינה יכולה לפתוח אותם. יש להתקין את הגרסה האחרונה כדי לפתוח את הנתונים.\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  "startup.newerDataDownload": "הורדת Spinbot",
  "startup.newerDataGuide": "פתיחת המדריך",
  "startup.newerDataQuit": "יציאה",
  "startup.recoveryWindowTitle": "שחזור Spinbot",
  "startup.recoveryTitle": "Spinbot לא נפתח",
  "startup.recoveryBody": {
    one: "Spinbot {version} נעצר לפני שנפתח, פעם אחת ({count}). הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
    two: "Spinbot {version} נעצר לפני שנפתח, פעמיים ברצף ({count}). הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
    other: "Spinbot {version} נעצר לפני שנפתח, {count} פעמים ברצף. הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  },
  "startup.recoveryHint":
    "נסה שוב, או התקן את הגרסה האחרונה שנפתחה. לקבלת עזרה, ייצא את נתוני האבחון ושלח את הקובץ עם הדיווח שלך.",
  "startup.recoveryRetry": "נסה שוב",
  "startup.recoveryPreviousVersion": "הורדת הגרסה הקודמת",
  "startup.recoveryExportDiagnostics": "ייצוא אבחון",
  "startup.recoveryOpenDataFolder": "פתיחת תיקיית הנתונים",
  "startup.recoveryQuit": "יציאה",
  "startup.recoveryDiagnosticsSaved": "קובץ האבחון נשמר.",
  "startup.recoveryActionFailed": "Spinbot לא הצליח לבצע את הפעולה הזו.",
} as const satisfies PartialTranslation<typeof source>;
