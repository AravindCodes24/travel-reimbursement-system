const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // you can attach user info here if needed
      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }
};

module.exports = { protect };
