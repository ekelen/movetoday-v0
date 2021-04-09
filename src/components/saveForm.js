import { useState } from "react";
import { Check, X } from "react-feather";
import { useFetchForHistory } from "../../state/history";

const SaveForm = ({ children, ...props }) => {
  const [apiKey, setApiKey] = useState("");

  const [success, loading, updateHistory] = useFetchForHistory(apiKey, [
    ...Object.keys(props.movesProgress),
  ]);
  const onEnterKey = (e) => {
    setApiKey(e.target.value);
  };

  const onMakeRequest = () => {
    updateHistory();
  };

  const formCn = "flex items-center relative";
  const formCnDisabled =
    "flex items-center relative opacity-60 cursor-default pointer-events-none";

  return (
    <div className={loading ? formCnDisabled : formCn}>
      <input
        id="api-key"
        type="text"
        aria-label="API Key"
        placeholder={"Enter API key"}
        onChange={onEnterKey}
        value={apiKey}
        disabled={loading}
        className={`w-min mr-2 text-xs py-1 px-1 rounded-sm flex items-center self-bottom focus:outline-none focus:ring-2 focus:ring-yellow-300 text-primary-100 placeholder-gray-100 bg-primary-700 hover:bg-primary-600`}
      ></input>
      <p className="absolute text-xs -bottom-5">
        {loading ? (
          <span className="animate-pulse">Loading...</span>
        ) : success === null ? (
          ""
        ) : success === false ? (
          <span className="text-red-500">Error saving. Check API key.</span>
        ) : (
          <span>Success.</span>
        )}
      </p>
      <button
        onClick={onMakeRequest}
        disabled={loading}
        className="flex items-center text-gray-800 bg-primaryAction-600 rounded-lg py-1 px-2 text-xs mr-2 font-bold hover:bg-primaryAction-500"
      >
        <Check size={18} /> <p className="ml-1">Submit</p>
      </button>

      <button
        className="flex items-center bg-primary-800 rounded-lg py-1 px-2 text-xs mr-2 font-bold hover:bg-primary-700"
        onClick={props.onCancel}
        disabled={loading}
      >
        <X size={18} />
        <p className="ml-1">Cancel</p>
      </button>
    </div>
  );
};
export default SaveForm;
