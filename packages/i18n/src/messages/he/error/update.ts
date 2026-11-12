import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/update";

export const messages = {
  "error.update.unsupported": "עדכונים זמינים בגרסאות שולחן עבודה מותקנות.",
  "error.update.notReady": "עדכון אינו מוכן להתקנה.",
  "error.update.restartFailed": "Spinbot לא הצליח להפעיל את עצמו מחדש כדי להתקין את העדכון.",
  "error.update.downloadStalled": "הורדת העדכון הפסיקה להגיב. יש לנסות שוב.",
  "error.update.installFailed": "לא ניתן להתקין את העדכון. יש לצאת מ-Spinbot, לפתוח אותו מחדש ולנסות שוב.",
  "error.update.downloadFailed": "לא ניתן להוריד את העדכון. יש לנסות שוב.",
  "error.update.checkFailed": "לא ניתן לבדוק אם יש עדכונים. יש לנסות שוב.",
  "error.update.checkStalled": "בדיקת העדכונים הפסיקה להגיב. יש לנסות שוב.",
  "error.update.checkOffline": "לא ניתן להתחבר לשירות העדכונים. יש לבדוק את חיבור האינטרנט ולנסות שוב.",
  "error.update.checkUnavailable": "שירות העדכונים לא הגיב. Spinbot ינסה שוב מעצמו בעוד כמה דקות.",
  "error.update.checkNoRelease": "לא נמצא עדכון שפורסם עבור הפלטפורמה הזו. Spinbot ינסה שוב מעצמו בעוד כמה דקות.",
  "error.update.managedByNix": "Nix מתקין עדכונים עבור העותק הזה של Spinbot. יש לעדכן אותו באמצעות Nix.",
  "error.update.managedByHost": "עדכונים ב-Mac הזה מותקנים על ידי המארח. העדכון נשאר מוכן עד להרצת התחזוקה של המארח.",
  "error.update.siblingSession":
    "סשן אחר של Spinbot עדיין פועל מהאפליקציה הזו. יש לעצור את Spinbot בכל חשבון משתמש אחר ב-macOS ואז להתקין את העדכון שוב.",
  "error.update.siblingSessionSameAccount":
    "תהליך אחר של Spinbot עדיין פועל בחשבון המשתמש הזה. יש לסגור אותו ואז להתקין את העדכון שוב.",
  "error.update.siblingCheckFailed": "לא ניתן לאמת סשנים אחרים של Spinbot. יש לנסות שוב לפני ההתקנה.",
  "error.update.readOnlyLocation":
    "Spinbot לא יכול להתקין עדכונים מהמיקום הזה. צא מ-Spinbot. ב-Finder, גרור את Spinbot לתיקייה 'יישומים' (אם הוא כבר שם, גרור אותו החוצה ובחזרה פנימה). לאחר מכן פתח את Spinbot והתקן את העדכון שוב.",
  "error.update.remoteDisabled": "עדכונים ממנהלי שרת כבויים במחשב הזה.",
  "error.update.restartStarted": "Spinbot כבר מופעל מחדש כדי להתקין את העדכון.",
  "error.update.alreadyRestarting": "Spinbot כבר מופעל מחדש.",
} as const satisfies PartialTranslation<typeof source>;
