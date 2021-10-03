export interface INode {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited?: boolean;
  previousNode?: INode;
}
