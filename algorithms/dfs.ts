import { INode } from "libs/types";
import { update_queue_with_unvisited_neighbors } from "libs/utils";

export const dfs = (grid: INode[][], startNode: INode, endNode: INode) => {
  // create visitedNodesInOrder array to keep track and animate
  const visitedNodesInOrder: INode[] = [];

  let stack: INode[] = [];
  stack.push(startNode);

  while (stack.length > 0) {
    const current = stack.pop();
    current.isVisited = true;
    visitedNodesInOrder.push(current);

    if (current.row === endNode.row && current.col === endNode.col) {
      return { visitedNodesInOrder, success: true };
    }
    update_queue_with_unvisited_neighbors(current, grid, stack);
  }

  return { visitedNodesInOrder, success: false }; // Not Found
};
