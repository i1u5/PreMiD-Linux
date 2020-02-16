import { Client } from "discord-rpc";
import { app } from "electron";

//* Import custom types
import PresenceData from "../../@types/PreMiD/PresenceData";

//* Define Presence array
export let rpcClients: Array<RPCClient> = [];

class RPCClient {
  clientId: string;
  currentPresence: PresenceData;
  client: Client;
  clientReady: boolean = false;

  constructor(clientId: string) {
    rpcClients.push(this);

    this.clientId = clientId;
    this.client = new Client({
      transport: "ipc"
    });

    this.client.once("ready", () => {
      this.clientReady = true;
      this.setActivity();
    });
    // @ts-ignore
    this.client.once("disconnected", this.destroy);

    this.client.login({ clientId: this.clientId }).catch(this.destroy);

    console.log(
      "Create client : " +
        (this.client
          ? this.client.application.name
          : "unknown")
    );
  }

  setActivity(presenceData?: PresenceData) {
    presenceData = presenceData ? presenceData : this.currentPresence;

    if (!this.clientReady || !presenceData) return;

    presenceData.presenceData.largeImageText += ` App v${app.getVersion()}`;
    this.client.setActivity(presenceData.presenceData).catch(this.destroy);
    console.log(
      "Set activity : " +
        (this.client
          ? this.client.application.name
          : "unknown")
    );
  }

  clearActivity() {
    this.currentPresence = null;

    if (!this.clientReady) return;

    this.client.clearActivity().catch(this.destroy);
  }

  destroy() {
    console.log("Destroy client", this.clientId);
    if (this.client) this.client.destroy().catch(() => {});
    rpcClients = rpcClients.filter(client => client.clientId !== this.clientId);
  }
}

/**
 * Sets the user's activity
 * @param presence PresenceData to set activity
 */
export function setActivity(presence: PresenceData) {
  let client = rpcClients.find(c => c.clientId === presence.clientId);

  if (!client) {
    client = new RPCClient(presence.clientId);
    client.currentPresence = presence;
  } else client.setActivity(presence);
}

/**
 * Clear a user's activity
 * @param clientId clientId of presence to clear
 */
export function clearActivity(clientId: string = undefined) {
  if (clientId) {
    let client = rpcClients.find(c => c.clientId === clientId);
    console.log(
      "Clear activity : " +
        (this.client
          ? this.client.application.name
          : "unknown")
    );
    client.clearActivity();
  } else {
    rpcClients.forEach(c => c.clearActivity());
    console.log("Clear activity");
  }
}

export async function getDiscordUser() {
  const user = await new Client({ transport: "ipc" }).login({
    clientId: "503557087041683458"
  });
  return user.user;
}

app.once("will-quit", () => {
  rpcClients.map(c => c.destroy());
});
