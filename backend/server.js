const { default: OpenAI } = require('openai');
const cors = require('cors');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer'); 
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const { db, admin } = require('./firebase');
const { styleText } = require('util');
const {HtmlTemplate} = require('./resumeHtmlTemplate')
const upload = multer();

const app = express()

let dataFromResume = ''

// let Airesponse = null


app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.text());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});




async function testFirestore(AiResponse, jobdesk, pdfdata, linkToJob, stylechoice) {
    // Reference to a Firestore collection and document
try {
  if(AiResponse?.contact?.email == 'missing'){
    console.log('error');
    return
  } 
  const docRef = db.collection('Job-applications').doc('application');

  // Writing a document
  docRef.update({
    resumeDataArray: admin.firestore.FieldValue.arrayUnion({
      jobdesk: jobdesk,
      styleChoice:stylechoice,
      AiResponse: AiResponse,
      linkToJob: linkToJob,
      pdfdata: pdfdata,
      resumeId: docRef.id, // This should be a unique ID for each new entry, perhaps generated differently if needed
      createdAt:  Date()
    })
  });

  console.log('Document written successfully.');

  // Reading the document
  const doc = await docRef.get();
  if (doc.exists) {
    // console.log('Document data:', doc.data());
  } else {
    console.log('No such document!');
  }
} catch (error) {
  console.log('firestore error: ',error);
}
    
  }
  
  // Run the test function
//   testFirestore().catch(console.error);


let jobDescriptionURL = ''
let response= null;

async function webDataExtracted(jobDescriptionURL){
    let browser;

    const openai =  new OpenAI({
apiKey: "sk-proj-PSnguLLGqsPNSDIHDkSUT3BlbkFJOTbe7Q5edUPpVYZpLOaA"
    })

    // const loadingIndicator = document.getElementById('loading');
    // const downloadResumeBtn = document.getElementById('download-resume');
    
    // Show the loading indicator
    // loadingIndicator.style.display = 'block';
    // loadingIndicator.style.display = 'none';
    

    try{

        const auth = 'brd-customer-hl_d046c2ce-zone-scraping_browser1:31m5e53md01q';
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`
        })

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2*60*1000);

        // jobDescriptionURL = document.getElementById('input-job-desc').ariaValueMax;
        console.log("Job Link here: ",jobDescriptionURL);
        // await page.goto('https://www.ziprecruiter.com/jobs/jet-technologies-c133175f/costing-clerk-data-entry-447e4e02?lvk=e04L6GkW2mCCZWwgDDowMg.--NQ0rN3PPN&zrclid=49e69343-aac5-406a-a000-6f3a8f2862a7');
        await page.goto(jobDescriptionURL);
        const client = await page.target().createCDPSession();

// Note 1: If no captcha was found it will return not_detected status after detectTimeout   
// Note 2: Once a CAPTCHA is solved, if there is a form to submit, it will be submitted by default   

        const {status} = await client.send('Captcha.solve', {detectTimeout: 30*1000});   
        console.log(`Captcha solve status: ${status}`)
        
        await page.screenshot({ path: 'screenshotfromlinkedin.png', fullPage: true });

        
        const body = await page.$('body')
        // await page.waitForSelector('.job_description')
        // const html = await page.evaluate(()=> document.body);
        const html = await page.content()

        // Load the HTML content into Cheerio
const $ = cheerio.load(html);

// Select the div with class "description"
const descriptionDiv = $('.job_description');

// console.log(descriptionDiv.html()); // Print the inner HTML of the div
const description = await getAllTextUnderArticle(descriptionDiv.html())
console.log(description); 

        // response = description
        // response = await openai.chat.completions.create(
        //     {
        //         model:"gpt-3.5-turbo-16k-0613",
        //         messages:[
        //             {role:'user',
        //         content:`create a one short and professional paragrah from this job description that i can use on my resume I just want it to sound like a match, only give the paragraph and nothing else: ${description}`}
        //         ]
        //     }
        // )

        // console.log('________________________________________Start______________________________________________');
        // // console.log( response);
        // console.log(2, response.choices[0].message.content);
        // console.log('_________________________________________End______________________________________________');
        
        // return response.choices[0].message.content;
        console.log(description);
        return 'description'
    }catch(e){
console.log("here is the error: "+e);
return 'catch'
    }
    finally{
        await browser?.close();

        // loadingIndicator.style.display = 'none';
        // downloadResumeBtn.style.display = 'block';
    }
}


async function AIchanges(jobDescription, initialResume){

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
`

    const openai =  new OpenAI({
        apiKey: "sk-proj-PSnguLLGqsPNSDIHDkSUT3BlbkFJOTbe7Q5edUPpVYZpLOaA"
            })

       response = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "You are a helpful Job assistant designed to output JSON.",
              },
              { role: "user", content: `
                I have extracted the following details from a resume: [${initialResume}] and a job description: [${jobDescription}]. Please:

                Transform the resume information to align better with the job description, emphasizing relevant skills and experiences.
                If any resume description are missing, do not make up data just indicate 'missing'  in their properties.
                Do not add skills not present in the initial resume, but you could add and infer skills from job experience if the initial resume does not have enough skills and keep it short use one word if possible for skills present all skill from resume and the one you infer if nessesary.
                Provide the result in JSON format: ${formatOfJson}.

                Estimate and include the percentage match to the job description before and after changes.
                always Offer advice in the advice property for improving the match, including suggestions for certifications, education, or projects.
`} ,
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
          });

        console.log('________________________________________Start______________________________________________');
        // console.log(2, response.choices[0].message.content);
        console.log('_________________________________________End______________________________________________');
        
        return response.choices[0].message.content;
        // return {'gpt endpoint': 'end point type shit'}
}


// createPdf()


function getAllTextUnderArticle(articleElement) {
    if (!articleElement) {
      console.error('.article element not found.');
      return '';
    }
  
    const visibleText = articleElement
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .trim();

  return visibleText;
  
  }





  let browser = null
async function sendBuffer(Airesponse, styleChoice){ 
    try {
         console.log('we are trying');
         browser = await puppeteer.launch();
         console.log('1 await');
         const page = await browser.newPage();
         console.log('2 await');

    //   await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'})
  
    //   Set the content of the page


    const resumeData = {
        name: "John Doe",
        title: "Software Engineer",
        contact: {
          email: "johndoe@example.com",
          phone: "+1234567890",
          address: "123 Main St, Anytown, USA"
        },
        summary: "Experienced software engineer with a strong background in developing scalable web applications and working with cutting-edge technologies.",
        experience: [
          {
            company: "Tech Solutions",
            position: "Senior Software Engineer",
            duration: "Jan 2020 - Present",
            description: "Lead a team of developers to build scalable web applications using modern frameworks."
          },
          {
            company: "Web Innovators",
            position: "Software Engineer",
            duration: "Jun 2015 - Dec 2019",
            description: "Developed and maintained web applications with a focus on performance and user experience."
          }
        ],
        education: [
          {
            institution: "State University",
            degree: "B.S. in Computer Science",
            duration: "Sep 2010 - May 2014"
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "HTML", "CSS"]
      };


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



app.get('/', (req, res) => {
    res.send('we say this: hello')
})


app.post("/extract-text-pdf", (req, res) => {
    console.log('fetch');
    if (!req.files || !req.files.pdfFile) {
        console.log('no file');
        return res.status(400).send("No file uploaded");
    }

    const pdfBuffer = req.files.pdfFile.data;

    pdfParse(pdfBuffer).then(result => {
        res.send(result);
        dataFromResume = result.text
    }).catch(error => {
        console.error('Error parsing PDF:', error);
        res.status(500).send("Error parsing PDF file");
    });
});


app.post('/downlaod-previous-resume', async (req, res) => {
  try {
    
    const {Airesponse, stylechoice} = req.body
    // const Airesponse = JSON.parse(Airesponses) 
    const all = await sendBuffer(Airesponse, stylechoice)
    res.send(all);
  } catch (error) {
    console.log('error in the endpoint of download from myresumes: ', error);
    res.status(500).send('An error occurred: ' + error.message);

  }

})
  app.post('/gpt', async (req, res) => {
    try {
        // const {jobdesc} = await webDataExtracted(req.body)
        // const response = await AIchanges(jobdesc,dataFromResume);
        const {jobdesk, linkToJob, styleChoice} = req.body
        const Airesponses = await AIchanges(jobdesk,dataFromResume);
        const Airesponse = JSON.parse(Airesponses) 
        console.log('Airesponse:');
        await testFirestore(Airesponse, jobdesk, dataFromResume, linkToJob, styleChoice)
        console.log('Airesponse:');
        const all = await sendBuffer(Airesponse, styleChoice)
        console.log('Airesponse:');
        
        const {
          contact,
          education,
          skills,
          workExperience,
          summary,
        } = Airesponse;
          if (
              contact.name == "missing" ||
              education[0].graduationYear == "missing" ||
              workExperience[0].company == "missing" ||
              summary == "missing"
            ) {
              console.log('send 500');
              res.status(500).send('yep it went wrong')
            }
        console.log("here is all", all)
        res.send(all);
    } catch (error) {

      console.log('error 500')
        res.status(500).send('An error occurred: ' + error.message);
    }
});


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
