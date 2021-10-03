import { AiFillGithub } from "react-icons/ai";
import { SiAbstract } from "react-icons/si";
import { GiPathDistance } from "react-icons/gi";
import { IconType } from "react-icons";

import Link from "next/link";
import { useRouter } from "next/router";

import { FunctionComponent, MouseEventHandler } from "react";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div
      className={`bg-dark-700 fixed flex-col justify-between h-screen px-3 sm:px-6 py-8 pb-20 text-lg shadow-lg flex z-10 sm:sticky top-0 sm:max-w-max  max-w-max`}
    >
      <div className="flex items-center justify-center space-x-2 font-medium ">
        <Link href="/">
          <a>
            <SiAbstract className="text-blue-600 cursor-pointer " size="30" />
          </a>
        </Link>
      </div>
      <div className="flex flex-col space-y-5 ">
        <SidebarItem Icon={GiPathDistance} text="Path Finder" handler={() => router.push("/pathFinder")} />

        <SidebarItem
          Icon={AiFillGithub}
          text="Github"
          handler={() => window.open("https://github.com/Dey-Sumit/visual-algo-v2")}
        />
      </div>
      <div></div>
    </div>
  );
}

const SidebarItem: FunctionComponent<{
  Icon: IconType;
  text: string;
  type?: string;
  handler?: MouseEventHandler<HTMLDivElement>;
}> = ({ Icon, text, handler, type }) => {
  return (
    <div className="navItem" onClick={handler}>
      <div className="relative ">
        <Icon size="30" className="flex-shrink-0" />
      </div>
    </div>
  );
};
