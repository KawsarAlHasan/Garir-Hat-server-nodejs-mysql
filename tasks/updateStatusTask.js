const cron = require("node-cron");
const transactionService = require("../services/transactionService");

const autoUpdateTransaction = () => {
  cron.schedule("0 0 * * *", () => {
    console.log("Running scheduled task to update transaction statuses.");

    transactionService.updateStatusToExpired((error, results) => {
      if (error) {
        return console.error("Error updating statuses:", error);
      }
      console.log(`Updated ${results.affectedRows} transaction(s) to expired.`);
    });
  });
};

module.exports = {
  autoUpdateTransaction,
};
