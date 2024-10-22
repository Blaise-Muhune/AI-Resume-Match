import React, { useEffect, useState } from "react";
// import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
// import axios from "axios";
// import UploadPdf from "./uploadPdf";
import { doc, setDoc } from "firebase/firestore";
import "./Home.css";
import { useAuth } from "./contexts/authContext";
import {  Link } from "react-router-dom";
import { doSignInWithGoogle } from "./firebase/auth";
import { IoMdMail } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaFileUpload, FaFilePdf } from "react-icons/fa";
import { ImCross } from "react-icons/im";
// import { FaPaste } from "react-icons/fa";

const App = () => {
  const currentUser = useAuth();

  const [file, setFile] = useState(null);
  const [jobdesk, setJobdesk] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [message, setMessage] = useState("...");
  // const [isReady, setIsready] = useState(null);
  const [text, setText] = useState("");
  const [resumeDataToUse, setResumeDataToUse] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [linkToJob, setLinkToJob] = useState("");
  const [isSignIn, setIsSignIn] = useState(null);
  const [wordcount, setWordcount] = useState(0);
  const [initialResumeClicked, setInitialResumeClicked] = useState(false)
  // const [reset, setReset] = useState(null)
  const MIN_WORDS = 600;
  const MAX_WORDS = 6000;

  useEffect(() => {
    if (currentUser.currentUser) {
      setIsSignIn(true);
      console.log(currentUser.currentUser);
    } else {
      setIsSignIn(false);
    }
  }, []);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChangeJobDesc = (event) => {
    const value = event.target.value;
    const charatersArrayCount = value.split("").length;
    const wordsArray = value.trim().split("");
    let wc = wordsArray.length;
    console.log(value);

    if (wc > MAX_WORDS) {
      const truncatedText = wordsArray.slice(0, MAX_WORDS).join("");
      setJobdesk(truncatedText);
      setWordcount(MAX_WORDS);
    } else {
      setJobdesk(value);
      setWordcount(wc);
    }
  };

  const handleChangeInputLinkJob = (event) => {
    const value = event.target.value;
    console.log(value);
    setLinkToJob(value);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      console.log(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      console.error("No file selected");
      alert("No file selected");
      return;
    }

    if (jobdesk.trim().split("").length < MIN_WORDS) {
      console.error("less than 100 word");
      alert("the Job Description must be at least 100 words");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("pdfFile", file);

    setLoadingMessage("extracting data from your resume...");
    await fetch("https://resume-backend-6zx09alyh-blaise-muhunes-projects.vercel.app/extract-text-pdf", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((responseText) => {
        console.log(responseText);
        setText(responseText);
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("something wrong with your resume pdf");
      });

    setLoadingMessage("AI enhancing");
    const styleChoice = ['template1','style1']
    const body = { jobdesk, linkToJob, styleChoice };
    let isEnoughData = null;

    await fetch("https://resume-backend-6zx09alyh-blaise-muhunes-projects.vercel.app/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
         if (
          response.status === 500
        ) {
          isEnoughData = false;
        }

        setResumeDataToUse(response);
        isEnoughData == false
          ? setMessage("Not enough data or wrong data input")
          : setMessage("Resume is ready");
        console.log(response.status);
      })
      .catch((error) => {

        console.error("Error:", error);
        setMessage("something went wrong, let try that again ");
      });

    setLoading(false);
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSignIn) {
      await doSignInWithGoogle().catch((err) => {
        setIsSignIn(false);
      });
      setIsSignIn(true);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const download = async (pdfBuffer) => {
    try {
      // const pdfBuffer = await fetch("http://localhost:5000/generate-pdf", {
      //   method: "POST",
      //   body: [0, 0],
      // });
      // if (!pdfBuffer.ok) {
      //   throw new Error("Network pdfBuffer was not ok");
      // }

      const blob = await pdfBuffer.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading PDF :", error);
    }

    // createResume(resumeDataToUse)

    
    if(window.confirm('reset all ?')){
      setFile(null);
      setJobdesk("");
      setLinkToJob("");
      setResumeDataToUse("");
      setWordcount("0");
      setInitialResumeClicked(false)
    }
    setMessage("...");
    setLoadingMessage("");
    setLoading("");
  };
  // const downloade = () => {};
  const useOriginalFile = () =>{
    setInitialResumeClicked(!initialResumeClicked)
  }
  // const Home = () => {
  //   const { currentUser } = useAuth()
  //   return (
  //       <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div>
  //   )
  // }

  return (
    <main className="main-container">
      {/* <FirebaseAuth/> */}
      <div className="upload-section">
        <h1 className="title">R.AI.SUME be more attractive</h1>
        {!loading ? (
          <form
            onSubmit={handleSubmit}
            className="upload-form"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <textarea
              className="job-description-input"
              onChange={handleChangeJobDesc}
              id="input-job-desc"
              placeholder="Paste job description here"
              value={jobdesk}
              rows="10"
              cols="50"
            ></textarea>
            <p>
              {wordcount} - ({MIN_WORDS + " - " + MAX_WORDS + " char(s)"})
            </p>
            <div className="flex flex-row *:mr-2">

            <div
              className={`file-input-container ${dragOver ? "drag-over" : ""} ${file? 'file-selected':''}  ${initialResumeClicked && !file ? 'opacity-30 cursor-not-allowed': 'cursor-wait'}`}
            >
              <input
              disabled={initialResumeClicked}
                type="file"
                onChange={handleFileChange}
                className={`file-input ${initialResumeClicked? 'cursor-not-allowed':'cursor-pointer'}`}
                id="file-input"
              />

              <label htmlFor="file-input" className="file-input-label">
                {file ? (
                  <div className="flex-row ">
                    <FaFilePdf className="w-full size-16" />
                    <p>{file.name}</p>
                  </div>
                ) : (
                  <div className="">
                    <FaFileUpload className="size-16 w-full" />
                    <p className="">Drop/select Resume (pdf only) </p>
                  </div>
                )}
              </label>
            </div>


            <div onClick={useOriginalFile}
              className={`orignal-file-container ${file? 'opacity-30 cursor-not-allowed': 'cursor-pointer'} ${initialResumeClicked && !file ? 'orignal-file-container-clicked': ''}`}
            >
              

              <label  className="file-input-label">
              
                  <div className={``} >
                    <FaFilePdf color={`${initialResumeClicked && !file ? 'white': ''}`}className={`size-16 w-full `} />
                    <p  style={initialResumeClicked && !file ? {color: 'white'}: null} className="">Use initial Resume </p>
                  </div>
                
              </label>
            </div>

            </div>
            <div
              className={
                !file
                ? "hidden "
                : "cursor-pointer w-fit text-white b-radi rounded p-1 bg-red-600"
              }
              onClick={() => handleRemoveFile()}
            >
              <ImCross />
            </div>

            <input
              className="job-description-input"
              type="text"
              onChange={handleChangeInputLinkJob}
              placeholder="Link to job (optional)"
              value={linkToJob}
            />
            {isSignIn ? (
              <button
                type="submit"
                className={
                  wordcount < MIN_WORDS || !file
                    ? "disabled-button"
                    : "upload-button"
                }
              >
                Create New Resume
              </button>
            ) : (
              ""
            )}
          </form>
        ) : (
          <div className="loading">{loadingMessage}</div>
        )}
        <div className="status">Status: {message}</div>
        <>
          {isSignIn ? (
            <button
              onClick={() =>
                message == "Resume is ready"
                  ? download(resumeDataToUse)
                  : alert("could not create resume because " + message)
              }
              className={
                message !== "Resume is ready"
                  ? " disabled-button "
                  : "download-button"
              }
            >
              Download New Resume
            </button>
          ) : (
            <div className=" text-gray-600 space-y-5 p-4 rounded-xl">
              <p className="m-5"> Log in to Download </p>
              <div className="w-full flex items-center align-middle justify-evenly border rounded-lg">
                <button
                  disabled={isSignIn}
                  onClick={(e) => {
                    onGoogleSignIn(e);
                  }}
                  className={` w-auto flex items-center justify-center gap-x-3 py-2.5  text-sm font-medium  ${
                    isSignIn
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-100 transition duration-300 active:bg-gray-100"
                  }`}
                >
                  {isSignIn ? (
                    "Signing In..."
                  ) : (
                    <FcGoogle className="size-16" />
                  )}
                </button>
                <Link to={"/login"} className="hover:underline font-bold">
                  <button
                    className={`w-full flex items-center justify-center gap-x-3 py-2.5  text-sm font-medium  ${
                      isSignIn
                        ? "cursor-not-allowed"
                        : "hover:bg-gray-100 transition duration-300 active:bg-gray-100"
                    }`}
                  >
                    {isSignIn ? (
                      "Signing In..."
                    ) : (
                      <IoMdMail className="size-16" />
                    )}
                  </button>
                </Link>
              </div>
            </div>
          )}
        </>
      </div>
    </main>
  );
};

export default App;
