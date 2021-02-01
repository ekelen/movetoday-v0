import tooManyMoves from "../src/data/cleanDataX10-146K.JSON";

const SecondPage = ({ ...props }) => {
  return (
    <article>
      <section>
        {Object.entries(props).map(([k, v]) => {
          return (
            <pre>
              {k}: {v}
            </pre>
          );
        })}
      </section>
      <section>
        {tooManyMoves.map((move) => {
          return <article>{move.name}</article>;
        })}
      </section>
    </article>
  );
};

export default SecondPage;
