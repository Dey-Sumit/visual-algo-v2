import { INode } from "./types";

interface NodeDetails {
  row: number;
  col: number;
  CURRENT_START_NODE_ROW: number;
  CURRENT_START_NODE_COL: number;
  CURRENT_END_NODE_ROW: number;
  CURRENT_END_NODE_COL: number;
}

export const createNode = ({
  CURRENT_END_NODE_COL,
  CURRENT_END_NODE_ROW,
  CURRENT_START_NODE_COL,
  CURRENT_START_NODE_ROW,
  col,
  row,
}: NodeDetails) => {
  return {
    row,
    col,
    isStart: row === CURRENT_START_NODE_ROW && col === CURRENT_START_NODE_COL,
    isEnd: row === CURRENT_END_NODE_ROW && col === CURRENT_END_NODE_COL,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
    isWall: false,
    // for aStar algorithm
    f: 0,
    g: 0,
    h: 0,
  };
};

export const createInitialGrid = () => {
  let temp_grid = [];
  for (let row = 0; row < 15; row++) {
    var currentRow = [];
    for (let col = 0; col < 30; col++) {
      //TODO
      //@ts-ignore
      currentRow.push(createNode({ row, col }));
    }
    temp_grid.push(currentRow);
  }
  return temp_grid;
};

export const getNewGridWallToggled = (grid: INode[][], row: number, col: number) => {
  const newGrid = grid.slice(); // create a copy
  // grab the node and toggle the wall property
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  // put the new toggled node in the new grid
  newGrid[row][col] = newNode;
  return newGrid;
};

export const get_nodes_in_shortest_path_order = (endNode: INode) => {
  console.log("get_nodes_in_shortest_path_order");

  const nodesInShortestPathOrder: INode[] = [];
  let currentNode = endNode;
  while (currentNode) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
};

export const get_unvisited_neighbors = (node: INode, grid: INode[][]) => {
  const neighbors: INode[] = [];
  const { row, col } = node;
  if (col > 0 && !grid[row][col - 1].isWall) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1 && !grid[row + 1][col].isWall) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1 && !grid[row][col + 1].isWall) neighbors.push(grid[row][col + 1]);
  if (row > 0 && !grid[row - 1][col].isWall) neighbors.push(grid[row - 1][col]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
};

export const update_queue_with_unvisited_neighbors = (node: INode, grid: INode[][], queue: INode[]) => {
  // get unvisited neighbors
  const unvisitedNeighbors = get_unvisited_neighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // set neighbor's prev node  = current node and add it to the queue(if not added)
    neighbor.previousNode = node; // !will be used for the reverse path tracking & animation

    if (!queue.includes(neighbor)) queue.push(neighbor);
  }
};
