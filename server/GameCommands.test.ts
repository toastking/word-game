import { Dispatcher } from "@colyseus/command";
import {
  BOARD_SIZE,
  BuildHorizontalWordCommand,
  calculatedIndex,
  PlaceTileCommand,
  RemoveTileCommand,
  BuildVerticalWordCommand,
  OnGameStartCommand,
} from "./GameCommands";
import { PlacedTile, Player, Tile, WordGameState } from "./GameRoom";
import { Room } from "./mock/colyseus";

describe("GameCommands", () => {
  let room: Room<WordGameState>;
  beforeEach(() => {
    room = new Room<WordGameState>();
    room.setState(new WordGameState());
  });

  describe("BuildHorizontalWordsCommand", () => {
    // FIRST TEST : no intersections
    const board1: Tile[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(new Tile());
    const tile1Tile = new Tile();
    tile1Tile.letter = "A";
    tile1Tile.points = 2;
    const tile1 = new PlacedTile(4, 0, tile1Tile);
    board1[calculatedIndex(tile1.row, tile1.column)] = tile1Tile;

    const tile2Tile = new Tile();
    tile2Tile.letter = "H";
    tile2Tile.points = 4;
    const tile2 = new PlacedTile(4, 1, tile2Tile);
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

  describe("BuildVerticalWordsCommand", () => {
    // FIRST TEST : no intersections
    const board1: Tile[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(new Tile());
    const tile1Tile = new Tile();
    tile1Tile.letter = "A";
    tile1Tile.points = 2;
    const tile1 = new PlacedTile(5, 4, tile1Tile);
    board1[calculatedIndex(tile1.row, tile1.column)] = tile1Tile;

    const tile2Tile = new Tile();
    tile2Tile.letter = "H";
    tile2Tile.points = 4;
    const tile2 = new PlacedTile(6, 4, tile2Tile);
    board1[calculatedIndex(tile2.row, tile2.column)] = tile2Tile;

    //SECOND TEST: one vertical intersections
    const board2: Tile[] = [...board1];
    const intersectionTile1 = new Tile();
    intersectionTile1.letter = "Z";
    intersectionTile1.points = 10;
    board2[calculatedIndex(5, 3)] = intersectionTile1;

    const intersectionTile2 = new Tile();
    intersectionTile2.letter = "A";
    intersectionTile2.points = 2;
    board2[calculatedIndex(5, 2)] = intersectionTile2;

    //THIRD TEST: intsection on the top and bottom of word
    const board3: Tile[] = [...board2];
    const intersectionTile3 = new Tile();
    intersectionTile3.letter = "E";
    intersectionTile3.points = 1;
    board3[calculatedIndex(5, 5)] = intersectionTile3;

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

        dispatcher.dispatch(new BuildVerticalWordCommand());

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
    const tile1Tile = new Tile();
    tile1Tile.letter = "A";
    tile1Tile.points = 2;
    const tile1 = new PlacedTile(4, 0, tile1Tile);
    board1[calculatedIndex(tile1.row, tile1.column)] = tile1Tile;

    //Test 2 valid placement
    const board2: Tile[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(new Tile());
    const tile2Tile = new Tile();
    tile2Tile.letter = "A";
    tile2Tile.points = 2;

    const tile2 = new PlacedTile(5, 0, tile2Tile);
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
        const player = new Player();
        player.hand.push(placedTile.tile);
        room.state.players["id"] = player;

        const dispatcher = new Dispatcher(room);

        dispatcher.dispatch(new PlaceTileCommand(), {
          tile: placedTile,
          sessionId: "id",
        });

        expect(room.state.gameBoard).toEqual(expectedBoard);
        expect(room.state.placedTiles).toEqual(expectedPlacedTiles);
      }
    );
  });

  describe("Remove Tile", () => {
    type PlaceTileTestExpectedTupe = [Tile[], PlacedTile[]];
    type PlaceTileTestTuple = [
      string,
      PlacedTile,
      Tile[],
      PlacedTile[],
      PlaceTileTestExpectedTupe
    ];

    //Test One: invalid placement
    const board2: Tile[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(new Tile());

    const tile2Tile = new Tile();
    tile2Tile.letter = "A";
    tile2Tile.points = 2;
    const tile2 = new PlacedTile(4, 0, tile2Tile);
    board2[calculatedIndex(tile2.row, tile2.column)] = tile2Tile;
    const expectedBoard2 = [...board2];
    expectedBoard2[calculatedIndex(tile2.row, tile2.column)] = new Tile();
    const expectedPlacedTiles2: PlacedTile[] = [];

    // Test Two: valid space
    const board1: Tile[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(new Tile());
    const tile1Tile = new Tile();
    tile1Tile.letter = "A";
    tile1Tile.points = 2;
    const tile1 = new PlacedTile(4, 0, tile1Tile);

    test.each<PlaceTileTestTuple>([
      ["Invalid space", tile1, board1, [], [board1, []]],
      [
        "Valid space",
        tile2,
        board2,
        [tile2],
        [expectedBoard2, expectedPlacedTiles2],
      ],
    ])(
      "%s",
      (
        _,
        placedTile,
        gameBoard,
        placedTiles,
        [expectedBoard, expectedPlacedTiles]
      ) => {
        room.state.gameBoard.push(...gameBoard);
        const player = new Player();
        player.hand.push(placedTile.tile);
        room.state.players["id"] = player;

        placedTiles.forEach((tile) => {
          room.state.placedTiles.push(tile);
        });

        const dispatcher = new Dispatcher(room);

        dispatcher.dispatch(new RemoveTileCommand(), {
          tile: placedTile,
          sessionId: "id",
        });

        expect(room.state.gameBoard).toEqual(expectedBoard);
        expect(room.state.placedTiles).toEqual(expectedPlacedTiles);
      }
    );
  });

  describe("OnGameStartedCommand", () => {
    test("sets up the game properly and locks the room when the game starts", () => {
      room.state.players["id"] = new Player("mort");
      const mockLockFn = jest.spyOn(room, "lock");

      const dispatcher = new Dispatcher(room);
      dispatcher.dispatch(new OnGameStartCommand());

      expect(room.state.currentTurn).toBe("id");
      expect(mockLockFn).toHaveBeenCalled();
      expect(room.state.gameStarted).toBe(true);
    });
  });
});
