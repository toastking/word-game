import * as Colyseus from 'colyseus.js';
import { WordGameState } from './schema/WordGameState';

/** Singleton wrapper so we can have a global colyseus service */
export class ColyseusService {
  /** Game server client */
  private readonly client = new Colyseus.Client('wss://api.zooted.app/');
  room?: Colyseus.Room<WordGameState>;

  getLobby() {
    return this.client.joinOrCreate('lobby');
  }

  /** Create a game and player with the given player name */
  async createGame(playerName: string) {
    this.room = await this.client.create('game', { playerNjjame: playerName });
  }

  /** Join an in progress game and create a player */
  async joinGame(roomId: string, playerName: string) {
    this.room = await this.client.joinById(roomId, { playerName });
    return this.room.id;
  }
}
