export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      res.status(404).json({ msg: `Route ${req.url} not found.` });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
