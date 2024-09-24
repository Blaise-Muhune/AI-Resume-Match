const { db, admin } = require('./firebase');

async function testFirestore(AiResponse, jobdesk, pdfdata, linkToJob, styleChoice) {
  try {
    if (AiResponse?.contact?.email === 'missing') {
      console.log('error');
      return;
    }
    
    const docRef = db.collection('Job-applications').doc('application');
    
    await docRef.update({
      resumeDataArray: admin.firestore.FieldValue.arrayUnion({
        jobdesk,
        styleChoice,
        AiResponse,
        linkToJob,
        pdfdata,
        resumeId: docRef.id,
        createdAt: Date()
      })
    });

    console.log('Document written successfully.');
  } catch (error) {
    console.log('Firestore error:', error);
  }
}

module.exports = { testFirestore };
