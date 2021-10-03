import heroImage from "@public/sort-guy.png";
import Image from "next/image";

const Home = () => {
  return (
    <div className="grid h-screen grid-cols-2 gap-4 p-2 place-items-center">
      <div className="col-span-1">
        <p>Get bored of algorithms :( It's actually entertaining</p>
        <h1>
          Welcome to <span>Algorithm Playground</span>
          where we will make them dance :)
        </h1>
        <div>
          <button>Sort my Career List</button>
          <button>Find my bae Path</button>
        </div>
      </div>
      <div className="col-span-1">
        <Image src={heroImage} />
      </div>
    </div>
  );
};

export default Home;
