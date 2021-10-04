import { INode } from "libs/types";
import { update_queue_with_unvisited_neighbors } from "libs/utils";

export const bfs = (grid: INode[][], startNode: INode, endNode: INode) => {
  // create visitedNodesInOrder array to keep track and animate
  const visitedNodesInOrder: INode[] = [];
  let queue: INode[] = [];
  queue.push(startNode);

  while (queue.length > 0) {
    const current = queue.shift(); // get the first element, set this as visited and add it to visitedNodesInOrder
    current.isVisited = true;
    visitedNodesInOrder.push(current);

    // check if we have got the end node
    if (current.row === endNode.row && current.col === endNode.col) {
      console.log("done");
      return { visitedNodesInOrder, success: true };
    }
    // else add the unvisited neighbors to the queue
    update_queue_with_unvisited_neighbors(current, grid, queue);
  }
  return { visitedNodesInOrder, success: false }; //Not Found
};
