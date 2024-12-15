const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expected: Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await userModel.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", error: err.message });
    }
    if(err.name === "InvalidTokenError"){
    return res
      .status(403)
        .json({ message: "Invalid token", error: err.message })
    }
    return res
      .status(500)
      .json({ message: "Internal error", error: err.message })
  }
};

function authorizeRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: You must have one of the following roles: ${allowedRoles.join(
          ", "
        )}`,
      });
      
    }
    next();
  };
}

exports.authorizeAdmin = authorizeRoles(["admin"]);
exports.authorizeStaff = authorizeRoles(["staff", "admin"]);
