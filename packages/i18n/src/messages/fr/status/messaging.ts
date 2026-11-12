import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/messaging";

export const messages = {
  "status.messaging.working": "En cours…",
  "status.messaging.queued": "En attente : Spinbot traite une autre demande. La réponse arrivera ici.",
  "status.messaging.busy": "Trop de demandes sont en attente. Réessayez plus tard.",
  "status.messaging.failed": "Spinbot n’a pas pu terminer cette demande. L’hôte Spinbot dispose des détails.",
  "status.messaging.noAnswer": "Spinbot a terminé sans réponse écrite.",
  "status.messaging.noAgent": "Aucun agent ne peut encore répondre ici. Ajoutez l’Orchestrateur Slack dans Spinbot.",
  "status.messaging.delegated": "Un coéquipier s’en occupe. La réponse arrivera ici.",
  "status.messaging.stopped": "Arrêté.",
  "status.messaging.stop": "Arrêter",
  "status.messaging.approvalTitle": "Spinbot demande une approbation pour continuer.",
  "status.messaging.approvalCommand": "Exécuter une commande",
  "status.messaging.approvalFileChange": "Modifier des fichiers",
  "status.messaging.approvalPermissions": "Obtenir plus d’autorisations",
  "status.messaging.approve": "Approuver",
  "status.messaging.deny": "Refuser",
  "status.messaging.approvedBy": "Approuvé par {user}.",
  "status.messaging.deniedBy": "Refusé par {user}.",
  "status.messaging.answeredOnHost": "Réponse donnée sur l’hôte Spinbot.",
  "status.messaging.requestInactive": "Cette demande n’est plus active.",
  "status.messaging.onlyRequester": "Seul {user} peut faire cela. L’hôte Spinbot peut aussi répondre.",
  "status.messaging.hostOnly": "Seul l’hôte Spinbot peut répondre à cette demande.",
  "status.messaging.filesSkipped": "Certains fichiers n’ont pas été envoyés : {names}.",
  "status.messaging.orchestratorName": "Orchestrateur Slack",
  "status.messaging.orchestratorTitle": "Répond dans Slack et consulte l’équipe",
  "status.messaging.discordNoAgent":
    "Aucun agent ne peut encore répondre ici. Ajoutez l’Orchestrateur Discord dans Spinbot.",
  "status.messaging.discordOrchestratorName": "Orchestrateur Discord",
  "status.messaging.discordOrchestratorTitle": "Répond dans Discord et consulte l’équipe",
  "status.messaging.integrationsSection": "Intégrations",
  "status.messaging.signInReceived": "Spinbot a reçu l’installation Slack. Vous pouvez fermer cet onglet.",
  "status.messaging.signInUnknown": "Spinbot n’a pas lancé cette installation Slack. Relancez-la dans Spinbot.",
  "status.messaging.telegramNoAgent":
    "Aucun agent ne peut encore répondre ici. Ajoutez l’Orchestrateur Telegram dans Spinbot.",
  "status.messaging.telegramLinked":
    "Spinbot est connecté à cette discussion. Mentionnez {bot} ou répondez à un message d’Spinbot pour solliciter les agents.",
  "status.messaging.telegramOrchestratorName": "Orchestrateur Telegram",
  "status.messaging.telegramOrchestratorTitle": "Répond dans Telegram et consulte l’équipe",
  "status.messaging.whatsappNoAgent":
    "Aucun agent ne peut encore répondre ici. Ajoutez l’Orchestrateur WhatsApp dans Spinbot.",
  "status.messaging.whatsappApprovalMenu": "Répondez 1 pour approuver ou 2 pour refuser.",
  "status.messaging.whatsappStopMenu": "Répondez « stop » pour arrêter.",
  "status.messaging.whatsappPairingCode":
    "Ce numéro répond uniquement aux personnes autorisées par son propriétaire. Donnez ce code au propriétaire : {code}",
  "status.messaging.whatsappPairingApproved": "Vous pouvez maintenant envoyer des demandes à ce numéro.",
  "status.messaging.whatsappOwnChat": "Message à vous-même",
  "status.messaging.whatsappWelcomeOwn":
    "👋 *Spinbot est connecté*\n\nÉcrivez ici pour poser vos questions à vos agents. Le WhatsApp Orchestrator répond, ou confie le travail au bon agent.\n\nEnvoyez *stop* pour arrêter une demande.",
  "status.messaging.whatsappWelcomeDedicated":
    "👋 *Spinbot est connecté*\n\nLes personnes que vous autorisez dans Spinbot peuvent maintenant écrire à ce numéro. Une nouvelle personne reçoit un code : approuvez-le dans Spinbot, sous Demandes.\n\nEnvoyez *stop* pour arrêter une demande.",
  "status.messaging.whatsappOrchestratorName": "Orchestrateur WhatsApp",
  "status.messaging.whatsappOrchestratorTitle": "Répond dans WhatsApp et consulte l’équipe",
} as const satisfies PartialTranslation<typeof source>;
