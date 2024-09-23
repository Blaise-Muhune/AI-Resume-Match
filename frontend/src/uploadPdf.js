import React, { useState } from 'react';

const UploadPdf = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', file);

    fetch('/api/extract-text', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.text())
    .then(responseText => {
      setText(responseText);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <h1>Upload PDF to Extract Text</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload and Extract Text</button>
      </form>
      <div>
        The Text: {text}
      </div>
    </div>
  );
};

export default UploadPdf;
