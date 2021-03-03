const SequenceDisplay = ({ sequenceHeader, sequenceMoves }) => {
  return (
    <div className="space-y-4 items-stretch content-start w-full text-primary-300 bg-primary-900 h-screen overflow-y-auto p-5 pt-0 flex flex-wrap ">
      {sequenceHeader}
      <div className="flex flex-wrap w-full">{sequenceMoves}</div>
    </div>
  );
};

export default SequenceDisplay;
