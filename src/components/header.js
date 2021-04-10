import { Fragment } from "react";
import { GitHub } from "react-feather";

const Header = ({ children }) => {
  // =============== tailwind class names

  const wrapperCn = "overflow-y-hidden p-2 mb-2 w-full bg-primary-400 h-20";
  const containerCn = "flex items-center items-center p-2 text-md";
  const logoCn =
    "block bg-heart bg-no-repeat bg-center bg-size-cover h-10 w-10";
  const appNameCn =
    "flex items-center text-2xl mx-2 md:mx-4 font-display text-primary-900";

  // =============== constants
  const name = "move today";
  return (
    // <header className={wrapperCn}>
    <div className={containerCn}>
      <Fragment>
        <div role="img" aria-label="logo" className={logoCn}></div>
        <div className={appNameCn}>{name}</div>
        {children}
        <div className="ml-auto flex items-center text-secondaryAction-800 text-sm font-bold ">
          <GitHub size={16} />
          <p className="ml-2 ">
            <a href="https://github.com/ekelen">ekelen</a>
          </p>
        </div>
      </Fragment>
    </div>
    // </header>
  );
};

export default Header;
