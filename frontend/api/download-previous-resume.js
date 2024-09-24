const puppeteer = require('puppeteer');
const { HtmlTemplate } = require('./resumeHtmlTemplate');

async function sendBuffer(Airesponse, styleChoice) {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    const [template, css] = styleChoice;
    const templateUsed = HtmlTemplate(template, css, Airesponse);
    await page.setContent(templateUsed);

    const pdfBuffer = await page.pdf({ path: 'heree.pdf' });
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    await browser?.close();
  }
}

module.exports = async (req, res) => {
  try {
    const { Airesponse, stylechoice } = req.body;
    const pdfBuffer = await sendBuffer(Airesponse, stylechoice);
    res.send(pdfBuffer);
  } catch (error) {
    console.log('Error in download-previous-resume endpoint:', error);
    res.status(500).send('An error occurred: ' + error.message);
  }
};
