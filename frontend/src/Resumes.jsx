import React, { useEffect, useState } from 'react';
import './Resumes.css';
import {  db } from './firebase/firebase';
import {  doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from './contexts/authContext';

const Resumes = () => {
  const [resumesData, setResumesData] = useState([]);
  const [error, setError] = useState(null);
//   const currentUser = useAuth();
  const auth = useAuth();
  const theAuth = auth.currentUser.auth;
  console.log(theAuth);
//     const auth = getAuth(app);
//   console.log(auth);
  console.log(auth.currentUser.auth);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const docRef = doc(db, 'Job-applications', 'application');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data().resumeDataArray[0]);
          setResumesData(docSnap.data().resumeDataArray)
        } else {
          console.log('No such document!');
        }
      } catch (err) {
        setError('Error fetching data. Missing or insufficient permissions.');
        console.error(err);
      }
    };
    
    onAuthStateChanged(theAuth, user => {
      if (user) {
        getProducts();
      } else {
        setError('User not authenticated');
      }
    });
  }, [auth]);

  function formatDateDisplay(date) {
    const today = new Date();
    const givenDate = new Date(date);
  
    // Remove the time part from both dates for accurate day comparison
    today.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);
  
    // Calculate the difference in days
    const diffTime = today.getTime() - givenDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return "Previous 7 Days";
    } else if (diffDays <= 30) {
      return "Previous 30 Days";
    } else {
      // For older dates, return the month's name
      return givenDate.toLocaleString('default', { month: 'long' });
    }
  }



  const download = async (index) => {

    const body = {Airesponse: resumesData[index].AiResponse, stylechoice: ['template1', 'style2']}
    await fetch("https://resume-backend-6zx09alyh-blaise-muhunes-projects.vercel.app/downlaod-previous-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then( async (pdfBuffer) => {

          const blob = await pdfBuffer.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "generated.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
      }).catch((error) => {
        console.error("Error downloading PDF :", error);
      })
  };

  return (
    <div className="resumes-list">
      {error ? <p>{error}</p> : resumesData.map((resume, index) => (
        <div className="resume-card" key={resume.resumeId}>
          <div className="resume-header">
            <h2>{resume.AiResponse.resumeDetails.company}</h2>
            <p className="date-generated">Made {formatDateDisplay(resume.createdAt)}</p>
          </div>
          <div className="resume-details">
            <p><strong>Position Applied:</strong> {resume.AiResponse.resumeDetails.position}</p>
            <p><strong>Applicant Name:</strong> {resume.AiResponse.resumeDetails.applicantName}</p>
          </div>
          <div className="resume-footer">
            <button onClick={()=>{download(index)}} className="download-button">Download Resume</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Resumes;
