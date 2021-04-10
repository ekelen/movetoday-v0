import { GitHub } from "react-feather";

const Header = ({ children }) => {
  // =============== tailwind class names

  const containerCn =
    "flex items-center items-center p-2 text-md text-primary-500";
  const logoCn =
    "block bg-heart bg-no-repeat bg-center bg-size-cover h-10 w-10";
  const appNameCn =
    "flex items-center text-2xl mx-2 md:mx-4 font-display whitespace-nowrap";

  // =============== constants
  const name = "move today";
  return (
    <div className={containerCn}>
      <div role="img" aria-label="logo" className={logoCn}></div>
      <div className={appNameCn}>{name}</div>
      {children}
      <div className="ml-auto flex items-center text-rose-400 text-sm font-bold ">
        <GitHub size={16} />
        <p className="ml-2 hidden sm:block ">
          <a href="https://github.com/ekelen">ekelen</a>
        </p>
      </div>
    </div>
  );
};

export default Header;
