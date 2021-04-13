import { GitHub } from "react-feather";

const Header = ({ children }) => {
  const appName = "move today";
  return (
    <div className="flex items-center items-center p-2 text-md text-primary-500">
      <div
        role="img"
        aria-label="logo"
        className="block bg-heart bg-no-repeat bg-center bg-size-cover h-10 w-10 mr-4"
      ></div>
      <h1 className="hidden md:flex items-center text-2xl mr-4 font-display whitespace-nowrap">
        {appName}
      </h1>
      {children}
      <a
        href="https://github.com/ekelen/movetoday-v0"
        className="cursor-pointer ml-auto text-rose-400"
      >
        <GitHub size={16} />
      </a>
    </div>
  );
};

export default Header;
