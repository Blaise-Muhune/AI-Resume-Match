// utils.js

import OpenAI from 'openai';

export async function AIchanges(jobDescription, initialResume) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const formatOfJson = `{
    "contact": {
      "name": "",
      "email": "",
      "phone": "",
      "linkedin": "",
      "address": "",
      "title":""
    },
    "summary": "",
    "workExperience": [
      {
        "title": "",
        "company": "",
        "dates": "",
        "responsibilities": [
          ""
        ]
      }
    ],
    "education": [
      {
        "degree": "",
        "institution": "",
        "graduationYear": ""
      }
    ],
    "skills": [
      ""
    ],
    "percentagematchingBefore": "",
    "percentagematchingAfter": "",
    "advice": "",
    "resumeDetails": {
      "company": "",
      "position": "",
      "applicantName":"",
    }
  }
  `;


  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful Job assistant designed to output JSON.",
      },
      {
        role: "user",
        content: `I have extracted the following details from a resume: [${initialResume}] and a job description: [${jobDescription}]. Please:
                  Transform the resume information to align better with the job description, emphasizing relevant skills and experiences.
                  Provide the result in JSON format: ${formatOfJson}.` // Your AI request content here
      },
    ],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
  });

  return sendBuffer(response.choices[0].message.content);
}

async function sendBuffer(Airesponse, styleChoice){ 
    try {
         console.log('we are trying');
         browser = await puppeteer.launch();
         console.log('1 await');
         const page = await browser.newPage();
         console.log('2 await');

    //   await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'})
  
    //   Set the content of the page


      [template, css] = styleChoice
     templateUsed = HtmlTemplate(template, css, Airesponse)
     await page.setContent(templateUsed)
    
    // Generate PDF
      console.log('3 await');
      const pdfBuffer = await page.pdf({path:'heree.pdf'});
      console.log('final');
  
    //   res.contentType('t');
      // res.send(pdfBuffer);
      return pdfBuffer
  
      // Send the PDF buffer as a response
    } catch (error) {
      console.error('Error generating PDF:', error);
    }finally{
        await browser.close();

    }
  };

