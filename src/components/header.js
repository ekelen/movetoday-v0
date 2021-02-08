const Header = ({ children }) => {
  const wrapperCn = "bg-primary-400 overflow-y-hidden border-bottom-4 p-2 mb-2";
  const logo = "bg-heart bg-no-repeat bg-center bg-size-cover";
  const name = "move today";
  return (
    <header className={wrapperCn}>
      <div className="grid grid-flow-col auto-cols-max grid-rows-1 gap-x-2 justify-items-center">
        <div role="img" aria-label="logo" className={`${logo} h-10 w-8`}></div>
        <div className="hidden lg:flex items-center text-2xl font-display text-primary-900">
          {name}
        </div>
        {children}
      </div>
    </header>
  );
};

export default Header;
