const jwt = require("jsonwebtoken");
exports.generateAdminToken = (adminInfo) => {
  const payload = {
    id: adminInfo.id,
    email: adminInfo.email,
  };
  const userToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "100 days",
  });

  return userToken;
};
