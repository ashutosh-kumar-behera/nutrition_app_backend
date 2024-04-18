const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "nutrifyApp", (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Invalid Token" });
      }
      req.user = decoded; // Add the decoded user to the request object
      next();
    });
  } else {
    res.status(401).send({ message: "Authorization token is missing" });
  }
};

module.exports = verifyToken;
