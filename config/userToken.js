const jwt = require("jsonwebtoken");
exports.generateUserToken = (userInfo) => {
  const payload = {
    email: userInfo.email,
  };
  const userToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "100 days",
  });

  return userToken;
};
