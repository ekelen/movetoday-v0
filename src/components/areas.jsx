import { areas, areaNames, getArea } from "../util/util";
import Move from "./move";
import MovesArea from "./movesArea";

const Areas = ({ children }) => {
  return (
    <section style={{ border: "1px solid orange" }}>
      <header>
        <h2>All moves</h2>
      </header>
      {children}
    </section>
  );
};

export default Areas;
