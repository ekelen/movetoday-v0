import { pages } from "../data/meta.json";

const Nav = ({ page, setPage }) => {
  const classNames = {
    navSelected:
      "bg-primaryAction-500 cursor-default mr-2 px-2 py-1 rounded-sm w-min focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-primary-300 active:ring-4 active:ring-offset-1 active:ring-primary-300",
    navUnselected:
      "bg-primary-500 cursor-pointer mr-2 px-2 py-1 rounded-sm w-min focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primaryAction-400",
  };

  const { EDIT, SEQUENCE } = pages;
  return (
    <nav className="whitespace-nowrap uppercase text-primary-800 font-bold">
      <button
        onClick={() => setPage(EDIT)}
        disabled={page === EDIT}
        className={
          page === EDIT ? classNames.navSelected : classNames.navUnselected
        }
      >
        EDIT
      </button>
      <button
        onClick={() => setPage(SEQUENCE)}
        disabled={page === SEQUENCE}
        className={
          page === SEQUENCE ? classNames.navSelected : classNames.navUnselected
        }
      >
        SEQUENCE
      </button>
    </nav>
  );
};
export default Nav;
