// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.39
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { Tile } from "./Tile"

export class Player extends Schema {
    @type("string") public name: string;
    @type("number") public score: number;
    @type([ Tile ]) public hand: ArraySchema<Tile> = new ArraySchema<Tile>();
}
