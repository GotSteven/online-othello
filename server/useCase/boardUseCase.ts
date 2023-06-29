import type { UserId } from '$/commonTypesWithClient/branded';
import { colorUseCase } from './colorUseCase';

let turnColor = 1;
const board: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
const directions = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [-1, -1],
  [0, -1],
];
export const boardUseCase = {
  getBoard: () => board,
  clickBoard: (x: number, y: number, userId: UserId): number[][] => {
    let putStone = false; //石を置いたか判定する変数
    if (colorUseCase.createColor(userId) === turnColor) {
      if (board[y][x] === 0) {
        //クリックした場所に石がないなら
        for (const [dy, dx] of directions) {
          //方向をひとつずつ dy と dx に分けて取り出す
          if (
            board[y + dy] !== undefined &&
            board[y + dy][x + dx] !== undefined &&
            board[y + dy][x + dx] === 3 - turnColor //取り出した方向に相手の石があるなら
          ) {
            for (let i = 1; i < 8; i++) {
              //その方向を1~7倍するためのi
              if (
                board[y + dy * i] !== undefined &&
                board[y + dy * i][x + dx * i] !== undefined &&
                board[y + dy * i][x + dx * i] === turnColor //その方向のi倍の位置に自分の石があるなら
              ) {
                let count = 0; //石のある場所の数をカウントする変数

                for (let i2 = 1; i2 <= i; i2++) {
                  //1から自分の石ある位置のiまで繰り返すi2
                  if (board[y + dy * i2][x + dx * i2] !== 0) {
                    //方向のi2倍の位置に石があるなら
                    count++;
                  }
                }
                if (count === i) {
                  //countが自分の石がある位置までの石の数と等しいなら
                  board[y][x] = colorUseCase.createColor(userId); //クリックした位置に石を置く
                  putStone = true; //石を置いたのでtrue
                  for (let i3 = 1; i3 < i; i3++) {
                    //はさんでいる部分を示すi3
                    board[y + dy * i3][x + dx * i3] = colorUseCase.createColor(userId); //はさんでいる相手の石を自分の石に変える
                  }
                }
                break; //今の方向は石を置き終わったので for (let i = 1; i < 8; i++) を break し次の方向へ
              }
            }
          }
        }
        if (putStone) {
          //すべての方向に対して繰り返しが終わったとき、石を置いているなら
          turnColor = 3 - turnColor;
          return board;
        }
      }
    }
  },
};
