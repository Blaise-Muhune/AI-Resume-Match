import pdfParse from "pdf-parse";

export default async (req, res) => {
  if (!req.files || !req.files.pdfFile) {
    return res.status(400).send("No file uploaded");
  }

  const pdfBuffer = req.files.pdfFile.data;

  try {
    const result = await pdfParse(pdfBuffer);
    res.status(200).send(result.text);
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).send("Error parsing PDF file");
  }
};
