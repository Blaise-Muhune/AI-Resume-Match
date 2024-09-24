const { AIchanges } = require('./utils');  // Extract AI change logic to ai-functions.js
const { testFirestore } = require('./test-firestore');  // Test Firestore update
const sendBuffer = require('./download-previous-resume');  // Reuse the sendBuffer function

module.exports = async (req, res) => {
  try {
    const { jobdesk, linkToJob, styleChoice } = req.body;
    const Airesponses = await AIchanges(jobdesk, req.body.resumeText);  // Pass resumeText
    const Airesponse = JSON.parse(Airesponses);

    // Store to Firestore
    await testFirestore(Airesponse, jobdesk, req.body.resumeText, linkToJob, styleChoice);

    // Generate PDF
    const pdfBuffer = await sendBuffer(Airesponse, styleChoice);
    res.send(pdfBuffer);

  } catch (error) {
    console.log('GPT error:', error);
    res.status(500).send('An error occurred: ' + error.message);
  }
};
