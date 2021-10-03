import { INode } from "libs/types";
import { get_unvisited_neighbors } from "libs/utils";

export const bfs = (grid: INode[][], startNode: INode, endNode: INode) => {
  console.log("bfs run");

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
  //TODO return success:false(if not found)
  return { visitedNodesInOrder, success: false };
};

const update_queue_with_unvisited_neighbors = (node: INode, grid: INode[][], queue: INode[]) => {
  // get unvisited neighbors
  const unvisitedNeighbors = get_unvisited_neighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // set neighbor's prev node  = current node and add it to the queue(if not added)
    neighbor.previousNode = node; // !will be used for the reverse path tracking & animation

    if (!queue.includes(neighbor)) queue.push(neighbor);
  }
};
