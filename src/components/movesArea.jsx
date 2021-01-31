const MovesArea = ({ areaTitle, children }) => {
  return (
    <section style={{ border: "1px solid blue" }}>
      <header>
        <h2>{areaTitle}</h2>
      </header>
      <article>{children}</article>
    </section>
  );
};

export default MovesArea;
