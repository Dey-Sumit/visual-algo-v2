import classNames from "classnames";
import { FC } from "react";
import { IconType } from "react-icons/lib";

interface Props {
  text: "bfs" | "dfs" | "aStar" | any;
  handler: any;
  active?: boolean;
  Icon?: IconType;
}

const CustomButton: FC<Props> = ({ text, handler, active, Icon }) => {
  return (
    <button
      onClick={() => handler(text)}
      className={classNames(
        "flex items-center justify-center px-4 py-2 tracking-wide text-white bg-gray-800 rounded-sm hover:bg-gray-700",
        {
          "border border-green-500": active,
        }
      )}
    >
      {/* Icon && <Icon /> */}
      <span>{text}</span>
    </button>
  );
};

export default CustomButton;
