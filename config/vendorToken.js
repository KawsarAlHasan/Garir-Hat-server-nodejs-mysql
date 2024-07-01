const jwt = require("jsonwebtoken");
exports.generateVendorToken = (vendorInfo) => {
  const payload = {
    email: vendorInfo.email,
  };
  const vendorToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "100 days",
  });

  return vendorToken;
};
