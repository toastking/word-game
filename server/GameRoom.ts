import { Room, Client } from "colyseus";

export class GameRoom extends Room {
  onCreate(options: any) {
    this.onMessage("type", (client, message) => {
      // handle "type" message
    });
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
