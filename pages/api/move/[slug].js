import { connectToCollection } from "../mongo/mongo";

export default function moveHandler(req, res) {
  const {
    query: { slug = "" },
    method,
    headers,
  } = req;

  switch (method) {
    case "GET":
      return connectToCollection()
        .then((collection) =>
          collection.findOne(
            { slug: slug.replace("-", "_") },
            { _id: 0, filteredIn: 0 }
          )
        )
        .then((move) => {
          if (!move)
            throw {
              msg: `Move "${slug}" may not exist or could not be retrieved.`,
            };
          res.status(200).json({ move });
        })
        .catch((err) => {
          console.log(err);
          console.log(`▶️ ${err.msg || err.message || err.toString()}`);
          res.status(500).json({ message: err.msg || "Server error." });
        });
    case "PUT": {
      const { authorization } = headers;
      const token = authorization.slice("Basic ".length);
      if (
        Buffer.from(token, "base64").toString("ascii") !==
        process.env.MOVETODAY_KEY
      ) {
        return res.status(401).json({ msg: "Bad API key." });
      }
      console.log("✓ token");
      return connectToCollection()
        .then((collection) =>
          collection.findOneAndUpdate(
            { slug: slug.replace("-", "_") },
            {
              $addToSet: {
                history: new Date(
                  new Date().toLocaleDateString()
                ).toISOString(),
              },
            },
            { projection: { _id: 0, filteredIn: 0 }, returnOriginal: false }
          )
        )
        .then((result) => {
          if (!result.value) {
            throw {
              msg: `Move "${slug}" may not exist or could not be retrieved.`,
            };
          }
          res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          console.log(`▶️ ${err.msg || err.message || err.toString()}`);
          res
            .status(500)
            .json({ message: err.msg || "Server error getting move list." });
        });
    }
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
