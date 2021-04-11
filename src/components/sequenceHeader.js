import { Fragment, useState } from "react";
import { Save, RotateCcw } from "react-feather";
import SaveForm from "./saveForm";

const Button = ({ onClick, disabled, children, ...props }) => {
  return (
    <button
      onClick={onClick}
      className="btn-pill btn-primary"
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
    <div className="flex items-center p-2 relative space-x-2 w-full">
      <Button onClick={onEdit} disabled={showForm}>
        ◀ Back
      </Button>
      <Button onClick={zeroAllProgress} disabled={showForm}>
        <RotateCcw size={16} />{" "}
        <span className="hidden md:inline ml-2">clear all progress</span>
      </Button>

      {showForm ? (
        <SaveForm
          onCancel={() => setShowForm(false)}
          movesProgress={movesProgress}
        />
      ) : (
        <Button onClick={() => setShowForm(true)}>
          <Save size={16} />
          <span className="ml-2">Save</span>
        </Button>
      )}
    </div>
  );
};

export default SequenceHeader;
