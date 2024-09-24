const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const cors = require('cors');

// Import the API routes
const extractTextPdf = require('./api/extract-text-pdf');
const downloadPreviousResume = require('./api/download-previous-resume');
const gpt = require('./api/gpt');

const app = express();

app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// API routes
app.post("/extract-text-pdf", extractTextPdf);
app.post('/download-previous-resume', downloadPreviousResume);
app.post('/gpt', gpt);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
