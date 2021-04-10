import { pages } from "../data/meta.json";

const Nav = ({ page, setPage }) => {
  const classNames = {
    navSelected:
      "active:ring-4 active:ring-offset-1 active:ring-primary-300 border-b-2 border-primaryAction-600 cursor-default focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-primary-300 mr-2 px-2 py-1 rounded-sm text-primary-500 w-min",
    navUnselected:
      "cursor-pointer focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-yellow-300 hover:bg-primaryAction-600 hover:text-primary-900 mr-2 px-2 py-1 rounded-sm text-primary-500 w-min",
  };

  const { EDIT, SEQUENCE } = pages;
  return (
    <nav className="whitespace-nowrap uppercase font-bold">
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
