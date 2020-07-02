//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 0.5.40
//

import {
  Schema,
  type,
  ArraySchema,
  MapSchema,
  DataChange,
} from '@colyseus/schema';

export class Tile extends Schema {
  @type('string') public letter: string;
  @type('number') public points: number;
}
