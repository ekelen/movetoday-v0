// 2021-02-16T23:54:01.651+00:00
import { connectToDatabase } from "../mongo/mongo.js";

export default function userHandler(req, res) {
  const {
    query: { id = 0, name = "no name" },
    method,
  } = req;

  switch (method) {
    case "GET":
      return connectToDatabase()
        .then((client) => client.db.collection("moves"))
        .then((collection) =>
          collection.findOne({ slug: id.replace("-", "_") }, { _id: 0 })
        )
        .then((result) => res.status(200).json({ id, result }));
    case "PUT":
      // Update or create move
      res.status(200).json({ id, name: name || `Move ${id}` });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
