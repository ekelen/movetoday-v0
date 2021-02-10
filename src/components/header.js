const Header = ({ children }) => {
  // =============== tailwind class names

  const wrapperCn = "overflow-y-hidden p-2 mb-2 w-full bg-primary-400";
  const containerCn =
    "grid grid-flow-col auto-cols-max grid-rows-1 gap-x-2 justify-items-center";
  const logoCn = "bg-heart bg-no-repeat bg-center bg-size-cover h-10 w-8";
  const appNameCn = "flex items-center text-2xl font-display text-primary-900";
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
