import { areas, areaNames, getArea } from "../util";
import Move from "./move";
import MovesArea from "./movesArea";

const Areas = ({ moves, selectedAreaNames, children }) => {
  return (
    <section>
      <header>
        <h2>Categories</h2>
      </header>
      {children}
    </section>
  );
};

export default Areas;
