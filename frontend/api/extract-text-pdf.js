const pdfParse = require("pdf-parse");

module.exports = (req, res) => {
  if (!req.files || !req.files.pdfFile) {
    return res.status(400).send("No file uploaded");
  }

  const pdfBuffer = req.files.pdfFile.data;

  pdfParse(pdfBuffer).then(result => {
    res.send(result);
    // Store result.text for later use if needed
  }).catch(error => {
    console.error('Error parsing PDF:', error);
    res.status(500).send("Error parsing PDF file");
  });
};
