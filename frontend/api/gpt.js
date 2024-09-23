import { db, admin } from "../firebase";
import { AIchanges, sendBuffer } from "./utils"; // Assuming you refactor helpers
import { testFirestore } from "./test-firestore";

export default async (req, res) => {
  try {
    const { jobdesk, linkToJob, styleChoice } = req.body;
    const Airesponses = await AIchanges(jobdesk, dataFromResume);
    const Airesponse = JSON.parse(Airesponses);

    await testFirestore(Airesponse, jobdesk, dataFromResume, linkToJob, styleChoice);

    const pdfBuffer = await sendBuffer(Airesponse, styleChoice);

    const { contact, education, skills, workExperience, summary } = Airesponse;
    if (
      contact.name === "missing" ||
      education[0].graduationYear === "missing" ||
      workExperience[0].company === "missing" ||
      summary === "missing"
    ) {
      return res.status(500).send("Incomplete resume data");
    }

    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Error in /gpt endpoint:", error);
    res.status(500).send("An error occurred: " + error.message);
  }
};
