const { Parser } = require("json2csv");

const exportToCSV = (data, fields) => {
  try {
    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(data);
  } catch (error) {
    console.error("CSV Export Error:", error);
    throw new Error("Failed to export data to CSV");
  }
};



module.exports = exportToCSV;
