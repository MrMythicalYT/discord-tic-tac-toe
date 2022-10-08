import { BLUE_CIRCLE, EMPTY_CIRCLE, RED_CIRCLE } from "./constants";

export default function parseBoard(content: string) {
  const parsedContent: Side[][] = content
    .split("\n")
    .map((c) => c.split(""))
    .map((c) =>
      c.map((e) =>
        e === RED_CIRCLE ? "red" : e === BLUE_CIRCLE ? "blue" : null
      )
    );
  return new Board(parsedContent);
}

export type Side = "red" | "blue" | null;

export class Board {
  circles: Side[][];
  constructor(boardData?: Side[][]) {
    if (
      boardData &&
      (!Array.isArray(boardData) || !boardData.every(Array.isArray))
    )
      throw new Error("Invalid board data");
    this.circles =
      boardData ?? Array.from({ length: 3 }, () => Array(3).fill(null));
  }
  placeSpot(side: Side, place: [x: number, y: number]) {
    let set =
    this.circles[place[0]].splice(place[1], 0, side)
    if (set.length)
      throw new Error(`This spot was already set: (${place[0]}, ${place[1]})`);
    return this;
  }
  toString() {
    return this.circles
      .map((c) =>
        c
          .map((e) =>
            e === "red" ? RED_CIRCLE : e === "blue" ? BLUE_CIRCLE : EMPTY_CIRCLE
          )
          .join("")
      )
      .join("\n");
  }
}
