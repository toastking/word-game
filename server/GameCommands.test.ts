import { Dispatcher } from "@colyseus/command";
import {
  BOARD_SIZE,
  BuildHorizontalWordCommand,
  calculatedIndex,
  PlaceTileCommand,
} from "./GameCommands";
import { PlacedTile, Player, Tile, WordGameState } from "./GameRoom";
import { Room } from "./__mocks__/colyseus";

describe("GameCommands", () => {
  let room: Room<WordGameState>;
  beforeEach(() => {
    room = new Room<WordGameState>();
    room.setState(new WordGameState());
  });

  describe("BuildHorizontalWordsCommand", () => {
    // FIRST TEST : no intersections
    const board1: Tile[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(new Tile());
    const tile1 = new PlacedTile();
    tile1.column = 0;
    tile1.row = 4;
    const tile1Tile = new Tile();
    tile1Tile.letter = "A";
    tile1Tile.points = 2;
    tile1.tile = tile1Tile;
    board1[calculatedIndex(tile1.row, tile1.column)] = tile1Tile;

    const tile2 = new PlacedTile();
    tile2.column = 1;
    tile2.row = 4;
    const tile2Tile = new Tile();
    tile2Tile.letter = "H";
    tile2Tile.points = 4;
    tile2.tile = tile2Tile;
    board1[calculatedIndex(tile2.row, tile2.column)] = tile2Tile;

    //SECOND TEST: one vertical intersections
    const board2: Tile[] = [...board1];
    const intersectionTile1 = new Tile();
    intersectionTile1.letter = "Z";
    intersectionTile1.points = 10;
    board2[calculatedIndex(3, 0)] = intersectionTile1;

    const intersectionTile2 = new Tile();
    intersectionTile2.letter = "A";
    intersectionTile2.points = 2;
    board2[calculatedIndex(2, 0)] = intersectionTile2;

    //THIRD TEST: intsection on the top and bottom of word
    const board3: Tile[] = [...board2];
    const intersectionTile3 = new Tile();
    intersectionTile3.letter = "E";
    intersectionTile3.points = 1;
    board3[calculatedIndex(5, 0)] = intersectionTile3;

    type HorizontalWordsTestTuple = [string, PlacedTile[], Tile[], number];
    const cases: HorizontalWordsTestTuple[] = [
      ["no intersections", [tile1, tile2], board1, 0],
      ["top intersection", [tile1, tile2], board2, 20],
      ["top and bottom intersection", [tile1, tile2], board3, 21],
    ];
    test.each<HorizontalWordsTestTuple>(cases)(
      "returns proper word list for %s",
      (_, placedTiles, board, expectedScore) => {
        room.state.gameBoard.push(...board);
        room.state.placedTiles.push(...placedTiles);
        room.state.players["id"] = new Player();
        room.state.currentTurn = "id";

        const dispatcher = new Dispatcher(room);

        dispatcher.dispatch(new BuildHorizontalWordCommand());

        expect((room.state.players["id"] as Player).score).toBe(expectedScore);
      }
    );
  });

  describe("PlaceTileCommand", () => {
    type PlaceTileTestExpectedTupe = [Tile[], PlacedTile[]];
    type PlaceTileTestTuple = [
      string,
      PlacedTile,
      Tile[],
      PlaceTileTestExpectedTupe
    ];

    // Test One: invalid space
    const board1: Tile[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(new Tile());
    const tile1 = new PlacedTile();
    tile1.column = 0;
    tile1.row = 4;
    const tile1Tile = new Tile();
    tile1Tile.letter = "A";
    tile1Tile.points = 2;
    tile1.tile = tile1Tile;
    board1[calculatedIndex(tile1.row, tile1.column)] = tile1Tile;

    //Test 2 valid placement
    const board2: Tile[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(new Tile());
    const tile2 = new PlacedTile();
    tile2.column = 0;
    tile2.row = 4;
    const tile2Tile = new Tile();
    tile2Tile.letter = "A";
    tile2Tile.points = 2;
    tile2.tile = tile2Tile;
    const expectedBoard2 = [...board2];
    expectedBoard2[calculatedIndex(tile2.row, tile2.column)] = tile2Tile;
    const expectedPlacedTiles2 = [tile2];

    test.each<PlaceTileTestTuple>([
      ["Invalid placement", tile1, board1, [board1, []]],
      [
        "Valid placement",
        tile2,
        board2,
        [expectedBoard2, expectedPlacedTiles2],
      ],
    ])(
      "%s",
      (_, placedTile, gameBoard, [expectedBoard, expectedPlacedTiles]) => {
        room.state.gameBoard.push(...gameBoard);

        const dispatcher = new Dispatcher(room);

        dispatcher.dispatch(new PlaceTileCommand(), { tile: placedTile });

        expect(room.state.gameBoard).toEqual(expectedBoard);
        expect(room.state.placedTiles).toEqual(expectedPlacedTiles);
      }
    );
  });
});
