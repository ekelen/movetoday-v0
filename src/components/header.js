const Header = ({ children }) => {
  // =============== tailwind class names

  const wrapperCn = "overflow-y-hidden p-2 mb-2 w-full bg-primary-400 h-20";
  const containerCn = "flex items-center";
  const logoCn =
    "block bg-heart bg-no-repeat bg-center bg-size-cover h-10 w-10";
  const appNameCn =
    "flex items-center text-2xl mx-2 md:mx-4 font-display text-primary-900";

  // =============== constants
  const name = "move today";
  return (
    <header className={wrapperCn}>
      <div className={containerCn}>
        <div role="img" aria-label="logo" className={logoCn}></div>
        <div className={appNameCn}>{name}</div>
        {children}
      </div>
    </header>
  );
};

export default Header;
