import Node from "@components/Node";
import { bfs } from "algorithms/bfs";
import { INode } from "libs/types";
import { get_nodes_in_shortest_path_order } from "libs/utils";
import { useEffect, useState } from "react";

import { motion, Variants } from "framer-motion";
import Stats from "@components/commons/Stats";
import ReactSlider from "react-slider";
import Slider, { createSliderWithTooltip } from "rc-slider";
import { useMediaQuery, useMediaQueries } from "@react-hook/media-query";
import { useWindowSize } from "rooks";
let CURRENT_START_NODE_ROW = 2;
let CURRENT_START_NODE_COL = 8;
let CURRENT_END_NODE_ROW = 8;
let CURRENT_END_NODE_COL = 2;

const createNode = (row: number, col: number) => {
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

const createInitialGrid = (cols: number) => {
  let temp_grid = [];
  for (let row = 0; row < 15; row++) {
    var currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(row, col));
    }
    temp_grid.push(currentRow);
  }
  return temp_grid;
};

const getNewGridWallToggled = (grid: INode[][], row: number, col: number) => {
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

const variantsRow: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.05,
    },
  },
};
const variantsContainer: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
    },
  },
};

const PathFinder = () => {
  const [mainGrid, setMainGrid] = useState<INode[][]>(null);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  const [currentAlgo, setCurrentAlgo] = useState<"bfs">("bfs");

  // node to be dragged(repositioned) is a start node or end node
  const [isStartNode, setIsStartNode] = useState(false);
  const [isEndNode, setIsEndNode] = useState(false);

  const [prevNodeIsWall, setPrevNodeIsWall] = useState(false);
  const [alreadyRan, setAlreadyRan] = useState(false);

  const [animationSpeed, setAnimationSpeed] = useState(20);
  const [animationRunning, setAnimationRunning] = useState(false);
  const [cols, setCols] = useState(25);

  const width_1130 = useMediaQuery("only screen and (min-width: 1130px)");
  //const width_500 = useMediaQuery("only screen and (min-width: 500px)");

  useEffect(() => {
    if (!width_1130 && cols !== 25) {
      setCols(25);
      setMainGrid(createInitialGrid(cols));
    } else if (width_1130 && cols !== 15) {
      setCols(15);
      setMainGrid(createInitialGrid(cols));
    }
  }, [width_1130, cols]);

  const [stats, setStats] = useState({
    algoName: currentAlgo,
    timeTaken: null,
    nodesTraversed: 0,
    fastestPath: 0,
    pathFound: null,
  });

  // useEffect(() => {}, [cols]);

  const resetColors = () => {
    const nodes = document.getElementsByClassName("node");
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].classList.remove("node-visited");
      nodes[i].classList.remove("node-shortest-path");
    }
  };

  const resetGrid = () => {
    setMainGrid(createInitialGrid(cols));
    resetColors();
    setAnimationRunning(false);
    setStats({
      algoName: currentAlgo,
      timeTaken: null,
      nodesTraversed: 0,
      fastestPath: 0,
      pathFound: null,
    });
  };
  // toggle the start when dragged
  const getNewStart = (grid: INode[][], row: number, col: number) => {
    const newGrid = grid.slice();
    const new_node = newGrid[row][col];
    const prev_node = newGrid[CURRENT_START_NODE_ROW][CURRENT_START_NODE_COL];

    const prevNode = {
      ...prev_node,
      isStart: false,
      isWall: prevNodeIsWall,
    };

    setPrevNodeIsWall(new_node.isWall);

    const newNode = {
      ...new_node,
      isWall: false,
      isStart: true,
    };
    newGrid[CURRENT_START_NODE_ROW][CURRENT_START_NODE_COL] = prevNode;
    newGrid[row][col] = newNode;
    //  console.log(newGrid);

    // update previous variables with current row and current col

    CURRENT_START_NODE_ROW = row;
    CURRENT_START_NODE_COL = col;

    return newGrid;
  };

  const getNewEnd = (grid: INode[][], row: number, col: number) => {
    const newGrid = grid.slice();
    const new_node = newGrid[row][col];
    const prev_node = newGrid[CURRENT_END_NODE_ROW][CURRENT_END_NODE_COL];
    //previous node
    const prevNode = {
      ...prev_node,
      isEnd: false,
      isWall: prevNodeIsWall,
    };
    setPrevNodeIsWall(new_node.isWall);

    const newNode = {
      ...new_node,
      isWall: false,
      isEnd: true,
    };
    newGrid[CURRENT_END_NODE_ROW][CURRENT_END_NODE_COL] = prevNode;
    newGrid[row][col] = newNode;

    // update previous variables with current row and current col

    CURRENT_END_NODE_ROW = row;
    CURRENT_END_NODE_COL = col;
    return newGrid;
  };

  const reArrangeGrid = (grid: INode[][]) => {
    // make sure don't reset the walls
    const newGrid = grid.slice();
    let node: INode;
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 30; col++) {
        node = newGrid[row][col];
        const newNode = {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        };
        newGrid[row][col] = newNode;
      }
    }
    return newGrid;
  };

  /* //! HOW IT WORKS : 
    MOUSE DOWN -> MOUSE ENTER -> MOUSE UP
   MOUSE DOWN : if the node is a start or end node(user wants to set a new start/end node),
   then we need to remove* the current start node add the new start node
   BUT , if it is neither a start or end node,then convert it to a wall or toggle it
 */
  const handleMouseDown = (row: number, col: number) => {
    let newGrid: INode[][];

    // check if the element to be dragged (which is clicked) is a start or end node
    if (row === CURRENT_START_NODE_ROW && col === CURRENT_START_NODE_COL) setIsStartNode(true);
    else if (row === CURRENT_END_NODE_ROW && col === CURRENT_END_NODE_COL) setIsEndNode(true);
    else {
      // else toggle isWall property of that node and update the mainGrid
      newGrid = getNewGridWallToggled(mainGrid, row, col);
      setMainGrid(newGrid);
    }
    //  set mouseIsPressed flag is true;now if user hover over any nodes; that will be converted
    // to a start node or end node or a wall (toggled) BETTER UX :)
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    let newGrid: INode[][];

    if (!mouseIsPressed) return;

    if (isStartNode === true) newGrid = getNewStart(mainGrid, row, col);
    else if (isEndNode === true) newGrid = getNewEnd(mainGrid, row, col);
    else newGrid = getNewGridWallToggled(mainGrid, row, col);

    // update the mainGrid
    setMainGrid(newGrid);
  };

  // when leave the mouse , reset the flags to false
  const handleMouseUp = () => {
    setMouseIsPressed(false);

    if ((isStartNode || isEndNode) && alreadyRan) {
      resetColors();
      setMainGrid(reArrangeGrid(mainGrid));
      getAnimateArray(currentAlgo);
    }

    setIsStartNode(false);
    setIsEndNode(false);
  };

  const animateShortestPath = (nodesInShortestPathOrder: INode[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        if (i === nodesInShortestPathOrder.length - 1) setAnimationRunning(false);
        const { row, col, isStart, isEnd } = nodesInShortestPathOrder[i];
        if (isStart || isEnd) return;
        document.getElementById(`node-${row}-${col}`).classList.add("node-shortest-path");
      }, i * animationSpeed);
      // subtract to reverse the slider value :)
    }
  };

  const animateTraversal = (visitedNodesInOrder: INode[], nodesInShortestPathOrder: INode[]) => {
    console.log("animateTraversal called");
    setAnimationRunning(true);

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        if (i === visitedNodesInOrder.length - 1) {
          //! end of traversal , now animate the path
          if (nodesInShortestPathOrder) animateShortestPath(nodesInShortestPathOrder);
        }
      }, i * (50 - animationSpeed));
      setTimeout(() => {
        const { row, col, isStart, isEnd } = visitedNodesInOrder[i];

        if (isStart || isEnd) return;
        document.getElementById(`node-${row}-${col}`).classList.add("node-visited");
      }, i * (50 - animationSpeed));
    }
  };

  const getAnimateArray = (algo: string) => {
    setAlreadyRan(true);
    const startNode = mainGrid[CURRENT_START_NODE_ROW][CURRENT_START_NODE_COL];
    const endNode = mainGrid[CURRENT_END_NODE_ROW][CURRENT_END_NODE_COL];
    const timerStart = performance.now();
    const { visitedNodesInOrder, success } = bfs(mainGrid, startNode, endNode);
    console.log({ visitedNodesInOrder, success });

    let nodesInShortestPathOrder: INode[];

    if (success) nodesInShortestPathOrder = get_nodes_in_shortest_path_order(endNode);
    const timerEnd = performance.now();
    const timeTaken = timerEnd - timerStart;
    setStats({
      ...stats,
      timeTaken: timeTaken.toFixed(3),
      fastestPath: nodesInShortestPathOrder?.length,
      nodesTraversed: visitedNodesInOrder?.length,
      pathFound: success,
    });
    animateTraversal(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  return (
    <div className="grid w-full h-full p-6 pt-8 place-items-center ">
      {/* <span className="button">
        {matches && "min width 1130"}
        {matches1 && "min width 600"}
      </span> */}
      {mainGrid && (
        <motion.div className="max-w-max" variants={variantsContainer} initial="initial" animate="animate">
          {mainGrid.map((row, j) => (
            <motion.div key={j} className="flex max-w-max" variants={variantsRow}>
              {row.map((node, i) => (
                <Node
                  key={i}
                  node={node}
                  handleMouseDown={handleMouseDown}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseUp={handleMouseUp}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>
      )}
      <Stats {...stats} />

      <div className="flex justify-around w-full md:w-2/3">
        {/* settings */}
        <div className="flex flex-col my-4 space-y-2 ">
          <span className="mb-6">Animation Speed</span>

          <ReactSlider
            min={10}
            max={40}
            disabled={animationRunning}
            onChange={(value) => setAnimationSpeed(value)}
            value={animationSpeed}
            //className="p-2 bg-red-500"
            //trackClassName="p-2 mt-5 bg-gray-700 rounded-full w-96"
            thumbClassName="bg-gray-800 p-4 -mt-7 rounded-sm cursor-pointer border-gray-600 border "
            className="p-2 mt-5 bg-gray-700 rounded-full w-96"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          />
        </div>

        {/* buttons */}
        <div className="flex items-center justify-center space-x-2 ">
          <button
            onClick={resetGrid}
            className="inline-flex items-center px-4 py-2 font-bold text-white bg-gray-700 rounded hover:bg-gray-600"
          >
            <span>Reset Grid</span>
          </button>
          <button
            onClick={() => {
              resetColors();
              setMainGrid(reArrangeGrid(mainGrid));
              getAnimateArray("bfs");
            }}
            className="inline-flex items-center px-4 py-2 font-bold text-white bg-gray-700 rounded hover:bg-gray-600"
          >
            <span>BFS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathFinder;
