import CountUp from "react-countup";

interface Props {
  algoName: string;
  timeTaken: number;
  nodesTraversed: number;
  fastestPath: number;
  pathFound: boolean;
}
const Stats = ({ algoName, timeTaken, nodesTraversed, pathFound, fastestPath }: Props) => {
  return (
    <div className="flex justify-around w-full p-2 space-x-4 bg-gray-800 rounded-md shadow-md md:w-2/3">
      <div className="flex flex-col items-center justify-center space-y-2">
        <span className="text-xl text-gray-100 ">Algo Name</span>
        <span className="text-lg">{algoName}</span>
      </div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <span className="text-xl text-gray-100 ">Path Found</span>
        <span className="text-lg">{pathFound ? "true" : "false"}</span>
      </div>{" "}
      <div className="flex flex-col items-center justify-center space-y-2">
        <span className="text-xl text-gray-100 ">Time Taken</span>
        <span className="text-lg">{timeTaken && <CountUp end={timeTaken} decimals={2} duration={2} />} ms </span>
      </div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <span className="text-xl text-gray-100 ">Nodes Traversed</span>
        <span className="text-lg">{nodesTraversed && <CountUp end={nodesTraversed} duration={2} />} nodes</span>
      </div>
      <div className="flex flex-col items-center justify-center space-y-2">
        <span className="text-xl text-gray-100 ">Fastest Path</span>
        <span className="text-lg">{fastestPath && <CountUp end={fastestPath} duration={2} />} nodes</span>
      </div>
    </div>
  );
};

export default Stats;
