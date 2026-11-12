import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/update";

export const messages = {
  "error.update.unsupported": "Updates zijn beschikbaar in geïnstalleerde desktopbuilds.",
  "error.update.notReady": "Er is geen update klaar om te installeren.",
  "error.update.restartFailed": "Spinbot kon niet herstarten om de update te installeren.",
  "error.update.downloadStalled": "De download van de update reageert niet meer. Probeer het opnieuw.",
  "error.update.installFailed":
    "Kan de update niet installeren. Stop Spinbot, open het opnieuw en probeer het nog eens.",
  "error.update.downloadFailed": "Kan de update niet downloaden. Probeer het opnieuw.",
  "error.update.checkFailed": "Kan niet controleren op updates. Probeer het opnieuw.",
  "error.update.checkStalled": "De controle op updates reageert niet meer. Probeer het opnieuw.",
  "error.update.checkOffline":
    "Kan de updateservice niet bereiken. Controleer je internetverbinding en probeer het opnieuw.",
  "error.update.checkUnavailable":
    "De updateservice reageerde niet. Spinbot probeert het over een paar minuten zelf opnieuw.",
  "error.update.checkNoRelease":
    "Er is geen gepubliceerde update gevonden voor dit platform. Spinbot probeert het over een paar minuten zelf opnieuw.",
  "error.update.managedByNix": "Nix installeert updates voor deze kopie van Spinbot. Werk hem bij met Nix.",
  "error.update.managedByHost":
    "Updates op deze Mac worden door de host geïnstalleerd. De update blijft klaarstaan tot het onderhoud van de host draait.",
  "error.update.siblingSession":
    "Er draait nog een andere Spinbot-sessie vanuit deze app. Stop Spinbot eerst in alle andere macOS-gebruikersaccounts en installeer de update dan opnieuw.",
  "error.update.siblingSessionSameAccount":
    "Er draait nog een ander Spinbot-proces in dit gebruikersaccount. Stop het en installeer de update dan opnieuw.",
  "error.update.siblingCheckFailed":
    "Kan andere Spinbot-sessies niet controleren. Probeer het opnieuw voordat je installeert.",
  "error.update.readOnlyLocation":
    "Spinbot kan vanaf deze locatie geen updates installeren. Sluit Spinbot af. Sleep Spinbot in de Finder naar de map Apps (staat het er al, sleep het er dan uit en weer in). Open Spinbot daarna en installeer de update opnieuw.",
  "error.update.remoteDisabled": "Updates door serverbeheerders staan uit op deze computer.",
  "error.update.restartStarted": "Spinbot herstart al om de update te installeren.",
  "error.update.alreadyRestarting": "Spinbot herstart al.",
} as const satisfies PartialTranslation<typeof source>;
