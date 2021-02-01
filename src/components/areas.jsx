import { areas, areaNames, getArea } from "../util";
import Move from "./move";
import MovesArea from "./movesArea";

const Areas = ({ children }) => {
  return (
    <section style={{ border: "1px solid orange" }}>
      <header>
        <h2>Categories</h2>
      </header>
      {children}
    </section>
  );
};

export default Areas;
