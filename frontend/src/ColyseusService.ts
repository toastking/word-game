import * as Colyseus from 'colyseus.js';
import { WordGameState } from './schema/WordGameState';

/** Singleton wrapper so we can have a global colyseus service */
export class ColyseusService {
  /** Game server client */
  private readonly client = new Colyseus.Client('ws://localhost:2567');
  room?: Colyseus.Room<WordGameState>;

  getLobby() {
    return this.client.joinOrCreate('lobby');
  }

  async createGame(playerName: string) {
    this.room = await this.client.create('game', { playerName: playerName });
  }
}
