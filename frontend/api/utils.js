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

  return response.choices[0].message.content;
}
