import { EMOJI_O, EMOJI_EMPTY, EMOJI_X } from "./constants";

export default function parseBoard(content: string) {
  const parsedContent: Side[][] = content
    .split("\n")
    .map((c) => c.split(""))
    .map((c) =>
      c.map((e) => (e === EMOJI_X ? "X" : e === EMOJI_O ? "O" : null))
    );
  return new Board(parsedContent);
}

export type Side = "X" | "O" | null;

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
    let current = this.circles[place[0]][place[1]];
    this.circles[place[0]][place[1]] = side;
    if (current)
      throw new Error(`This spot was already set: (${place[0]}, ${place[1]})`);
    return this;
  }
  toString() {
    return this.circles
      .map((c) =>
        c
          .map((e) => (e === "X" ? EMOJI_X : e === "O" ? EMOJI_O : EMOJI_EMPTY))
          .join("")
      )
      .join("\n");
  }
  winner(): Side | null {
    const check1 = this.circles.find((c, i, a) =>
      c.some((s) => a[i].every((x) => x && x === s))
    )?.[0];
    const check2 = this.circles.find((c, i, a) =>
      c.some((s) => a.every((x) => x[i] && x[i] === s))
    )?.[0];
    const middle = this.circles[1][1];
    const check3 =
      (middle &&
        [this.circles[0][0], this.circles[2][2]].every((x) => x === middle)) ||
      [this.circles[2][0], this.circles[0][2]].every((x) => x === middle)
        ? middle
        : null;
    return check1 || check2 || check3 || null;
  }
}
