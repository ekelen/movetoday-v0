import { Fragment, useState } from "react";
import { Save } from "react-feather";
import SaveForm from "./saveForm";

const Button = ({ onClick, disabled, children, ...props }) => {
  return (
    <button
      onClick={onClick}
      className="btn-pill self-center"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const SequenceHeader = ({
  children,
  selectedMoves,
  movesProgress,
  onEdit,
  zeroAllProgress,
  ...props
}) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <Fragment>
      <div className="relative w-full p-2 flex items-center space-x-2">
        <Button onClick={onEdit}>◀ Back</Button>
        <Button onClick={zeroAllProgress}>
          <p className="font-mono mr-2 rounded-full bg-black text-primaryAction-600 h-6 w-6">
            0
          </p>
          clear all progress
        </Button>

        {showForm ? (
          <SaveForm
            onCancel={() => setShowForm(false)}
            movesProgress={movesProgress}
          />
        ) : (
          <Button onClick={() => setShowForm(true)}>
            <p
              className={
                "relative font-mono mr-2 rounded-full bg-black text-primaryAction-600 h-6 w-6 px-1 py-1"
              }
            >
              <span className="h-full align-middle">
                <Save size={16} />
              </span>
            </p>
            {"save"}
          </Button>
        )}
      </div>
    </Fragment>
  );
};

export default SequenceHeader;
