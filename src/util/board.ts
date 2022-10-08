import { EMOJI_O, EMOJI_EMPTY, EMOJI_X } from "./constants";

export default function parseBoard(content: string) {
  const parsedContent: Side[][] = content
    .split("\n")
    .map((c) => c.split(""))
    .map((c) =>
      c.map((e) =>
        e === EMOJI_X ? "red" : e === EMOJI_O ? "blue" : null
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
            e === "red" ? EMOJI_X : e === "blue" ? EMOJI_O : EMOJI_EMPTY
          )
          .join("")
      )
      .join("\n");
  }
}
