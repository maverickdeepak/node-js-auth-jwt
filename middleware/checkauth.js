const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const token = req.header("token");

  if (!token) {
    return res.status(403).json({
      error: {
        msg: "No Token found ",
      },
    });
  }

  try {
    const user = jwt.verify(token, "thisisupersecretofapplication");
    req.user = user.email;
    next();
  } catch (error) {
    return res.status(403).json({
      error: {
        msg: "Invalid Token",
      },
    });
  }
};
