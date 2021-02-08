const AvailableMove = ({ move, onClick, selected }) => {
  const { name, focus } = move;
  const selectedClass = "bg-primary-700 text-primary-100 opacity-50";
  const unselectedClass = "bg-secondary-900 text-primary-100";
  return (
    <button
      aria-label={`select ${name}`}
      disabled={selected}
      onClick={onClick}
      className={`${
        selected ? selectedClass : unselectedClass
      } flex text-sm items-center py-2 px-2 rounded-md justify-between font-mono`}
    >
      <div className="mr-2 text-xs">{name}</div>
      <div className="text-secondary-200 bg-primary-800 text-xs px-2 py-1 rounded">
        {focus}
      </div>
    </button>
  );
};

const SelectedMove = ({ move, onClick }) => {
  const { name, focus } = move;
  return (
    <button
      aria-label={`unselect ${name}`}
      onClick={onClick}
      className={`font-mono bg-secondary-600 flex text-sm items-center py-2 px-2 rounded-md`}
    >
      <div className="mr-2">{name}</div>
      <div className="text-secondary-200 bg-primary-800 text-xs px-2 py-1 rounded">
        {focus}
      </div>
    </button>
  );
};

const Move = ({
  selected = false,
  area = "available",
  move = {},
  onClick = () => {},
}) => {
  return area === "available" ? (
    <AvailableMove selected={selected} move={move} onClick={onClick} />
  ) : (
    <SelectedMove move={move} onClick={onClick} />
  );
};

export default Move;
