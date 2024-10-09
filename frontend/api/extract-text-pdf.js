import pdfParse from "pdf-parse";
import multer from "multer";

// Initialize multer and set up in-memory storage
const upload = multer();

// Define the API route
export default async (req, res) => {
  // Handle the file upload
  upload.single("pdfFile")(req, res, async (err) => {
    if (err) {
      return res.status(500).send("Error uploading file");
    }

    // Check if the file exists in the request
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const pdfBuffer = req.file.buffer;

    try {
      // Parse the PDF buffer
      const result = await pdfParse(pdfBuffer);
      res.status(200).send(result.text);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      res.status(500).send("Error parsing PDF file");
    }
  });
};
