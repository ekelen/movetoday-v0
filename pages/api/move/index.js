import { sortBy } from "lodash";
import { foci } from "../../../src/data/meta.json";
import { connectToCollection } from "../mongo/mongo";

const dbMoveListSort = (arrayOfMoves, arrayOfKeys) =>
  sortBy(arrayOfMoves, (move) => arrayOfKeys.indexOf(move.focus), ["name"]);

export default function movesHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return connectToCollection()
        .then((collection) => {
          return collection.find({}, { _id: 0, filteredIn: 0 }).toArray();
        })
        .then((results) => {
          if (results.length < 1)
            throw { message: "No results could be retrieved from database." };
          res.status(200).json({ moveList: dbMoveListSort(results, foci) });
        })
        .catch((err) => {
          console.log(err);
          console.log(`▶️ ${err.msg || err.message || err.toString()}`);
          res
            .status(500)
            .json({ message: err.msg || "Server error getting move list." });
        });
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
