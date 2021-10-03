import { INode } from "libs/types";
import { FC, MouseEventHandler } from "react";

interface Props {
  node: INode;
  handleMouseDown: (row: number, col: number) => void;
  handleMouseEnter: (row: number, col: number) => void;
  handleMouseUp: () => void;
}

const Node: FC<Props> = ({
  node: { row, col, isStart, isEnd, isWall },
  handleMouseUp,
  handleMouseDown,
  handleMouseEnter,
}) => {
  // check if this node is start or end node then go for isWall , else this node will be converted to wall color
  const extraClass = isStart ? "start-node" : isEnd ? "end-node" : isWall ? "bg-pink-700" : "";
  return (
    <span
      id={`node-${row}-${col}`}
      className={`w-8 h-8 inline-block border-green-600 border node ${extraClass}`}
      onMouseEnter={() => handleMouseEnter(row, col)}
      onMouseDown={() => handleMouseDown(row, col)}
      onMouseUp={() => handleMouseUp()}
    ></span>
  );
};

export default Node;
