import { defineMessages } from "../../../message";

export const messages = defineMessages("status.host", {
  // Status lines of the WebRTC host.
  "status.host.registered": "Registered this Spinbot for WebRTC access.",
  "status.host.keyRotated": "Server key changed. Paired devices stay paired.",
  "status.host.identityUpdated": "Server identity updated.",
  "status.host.starting": "Starting the WebRTC host…",
  "status.host.ready": "This Spinbot is ready for WebRTC connections.",
  "status.host.signalLost": "Other devices cannot reach this Spinbot now. It connects again.",
  "status.host.stopping": "Making this Spinbot private…",
  "status.host.private": "This Spinbot is private.",
  "status.host.removed": "This Spinbot was removed from your account. Publish it again to share it.",
});
