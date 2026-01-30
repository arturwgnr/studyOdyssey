import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log(req.headers.authorization);
  console.log(process.env.JWT_SECRET);

  if (!authHeader) {
    return res.status(401).json({ error: "NO_TOKEN" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}
