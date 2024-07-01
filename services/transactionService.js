const db = require("../config/db");

const updateStatusToExpired = (callback) => {
  const sql =
    "UPDATE transactions SET status = ? WHERE endDate < CURDATE() AND status = ?";
  const values = ["Expired", "Active"];

  db.query(sql, values, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

module.exports = {
  updateStatusToExpired,
};
