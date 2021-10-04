import ReactSlider from "react-slider";

const Header = ({ animationRunning, animationSpeed, setAnimationSpeed }) => {
  return (
    <div className="h-[13vh] px-4 bg-[#111621] border-b border-gray-800 shadow-lg">
      <div className="flex flex-col my-4 space-y-2 ">
        <span className="mb-4 text-sm ">Animation Speed</span>

        <ReactSlider
          min={10}
          max={40}
          disabled={animationRunning}
          onChange={(value) => setAnimationSpeed(value)}
          value={animationSpeed}
          //trackClassName="p-2 mt-5 bg-gray-700 rounded-full w-96"
          thumbClassName="bg-gray-800 p-2 -mt-5 rounded-sm cursor-pointer border-gray-600 border "
          className="p-1 mt-5 bg-gray-700 rounded-full w-96"
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
      </div>
    </div>
  );
};

export default Header;
