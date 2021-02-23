import { Fragment, useState } from "react";
import { useFetchForHistory } from "../../state/history";
const windowCheck = () => typeof window !== "undefined";
const LS_ACCESS = "LS_ACCESS";
const LS_APIKEY = "LS_API_KEY";

export const EDITOR = "EDITOR";
export const READER = "READER";

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
  const [apiKey, setApiKey] = useState("");
  // const [showForm, setShowForm] = useState(false);
  const { response, updateHistory } = useFetchForHistory(apiKey, [
    ...Object.keys(movesProgress),
  ]);

  // const onEnterKey = (e) => {
  //   setApiKey(e.target.value);
  // };

  // const onMakeRequest = () => {
  //   console.log("onMakeRequest");
  //   updateHistory();
  // };

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
        {/* {(!showForm || !loading) && (
          <Button
            onClick={() => (!authed ? setShowForm(true) : onMakeRequest())}
          >
            <p className="relative font-mono mr-2 rounded-full bg-black text-primaryAction-600 h-6 w-6 px-1 py-1">
              <span className="h-full align-middle">
                <Save size={16} />
              </span>
            </p>
            {authed ? "save" : "login + save"}
          </Button>
        )} */}
        {/* {!authed && showForm && (
          <div className="flex items-center">
            <input
              id="api-key"
              type="text"
              aria-label="API Key"
              placeholder="Enter API key"
              onChange={onEnterKey}
              value={apiKey}
              className={`w-min mr-2 text-xs py-1 px-1 rounded-sm flex items-center self-bottom focus:outline-none focus:ring-2 focus:ring-yellow-300 text-primary-100 placeholder-gray-100 bg-primary-700 hover:bg-primary-600`}
            ></input>
            <button
              className="flex items-center bg-primary-800 rounded-lg py-1 px-2 text-xs mr-2 font-bold"
              onClick={onMakeRequest}
            >
              <Check size={18} /> <p className="ml-1">Submit</p>
            </button>
            <button
              className="flex items-center bg-primary-800 rounded-lg py-1 px-2 text-xs mr-2 font-bold"
              onClick={() => setShowForm(false)}
            >
              <X size={18} />
              <p className="ml-1">Cancel</p>
            </button>
          </div>
        )} */}
        <div className="flex-auto ml-auto mr-0 flex justify-end text-primary-300 border-2 hidden">
          {/* <p>{error && `Error: ${error}`}</p>
          <p className="font-mono">{`Loading: ${loading}`}</p> */}
        </div>
        <div className="p-2 pt-0 text-primary-300 text-bold hidden">
          {/* {displayMessage} */}
        </div>
      </div>
    </Fragment>
  );
};

export default SequenceHeader;
