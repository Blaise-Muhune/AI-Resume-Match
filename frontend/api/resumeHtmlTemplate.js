

function HtmlTemplate(template, css, resumeData){
          const obj = {
            template1:{
              html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume</title>
          <style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.6;
    background-color: #f4f4f4;
    color: #333;
    height: 297mm; /* A4 height */
    width: 210mm; /* A4 width */
  }

  html {
    height: 297mm; /* A4 height */
    width: 210mm; /* A4 width */
  }

  @page {
    size: A4;
    margin: 0; /* No margins for simplicity */
  }
    .container {
    width: calc(100% - 96px); /* Subtracting the combined left and right margins (48px each) */
    margin: 48px; /* 48px on all sides */
    background: #fff;
    box-sizing: border-box; /* Ensures padding and borders are included in the element's total width and height */
              .header {
    text-align: center;
    padding-bottom: 20px;
  }

  ${'${templateStyle}'}  /* Ensures that templateStyle is correctly interpolated */
  
</style>

        </head>
<body>
  <div class="container">
    <div class="header">
      <h2>${resumeData.contact.name}</h2>
      <h3>${resumeData.contact.title}</h3>
    </div>
    <div class="contact-info">
      <p>Email: ${resumeData.contact.email}</p>
      <p>Phone: ${resumeData.contact.phone}</p>
      <p>LinkedIn: ${resumeData.contact.linkedin}</p>
      <p>Address: ${resumeData.contact.address}</p>
    </div>
    <div class="section">
      <h2>Summary</h2>
      <p>${resumeData.summary}</p>
    </div>
    <div class="section">
      <h2>Work Experience</h2>
      ${resumeData.workExperience.map(exp => `
        <div class="experience">
          <h3>${exp.title} at ${exp.company}</h3>
          <p>${exp.dates}</p>
          <ul>
            ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
    <div class="section">
      <h2>Education</h2>
      ${resumeData.education.map(edu => `
        <div class="education">
          <h3>${edu.degree}</h3>
          <p>${edu.institution}</p>
          <p>Graduation Year: ${edu.graduationYear}</p>
        </div>
      `).join('')}
    </div>
    <div class="section">
      <h2>Skills</h2>
      <div class="skills">
        <ul>
          ${resumeData.skills.map(skill => `<li>${skill}</li>`).join(', ')}
        </ul>
      </div>
    </div>
  </div>
</body>
</html>

        `,
              style1:`
  .header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.header h2 {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.header::after {
  content: "";
  display: block;
  width: 50%;
  margin: 10px auto;
  border-bottom: 2px solid #333;
}

.contact-info {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #333;
}

.section {
  margin-bottom: 20px;
}

.section h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  text-transform: uppercase;
  border-bottom: 2px solid #ddd;
  padding-bottom: 3px;
}

.experience, .education {
  margin-bottom: 10px;
}

.experience h3, .education h3 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 5px;
  display: flex;
  justify-content: space-between;
}

.education p, .experience p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.skills ul {
  list-style: none;
  padding: 0;
  columns: 2; /* Display skills in two columns */
}

.skills ul li {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.5;
}

.awards p {
  font-size: 14px;
  color: #333;
  margin: 5px 0;
}`,
              style2:`

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.header h2 {
  margin: 0;
  font-size: 18px;
  color: #555;
}

.contact-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
}

.contact-info p {
  margin: 0;
}

.section {
  margin-bottom: 15px;
}

.section h2 {
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #444;
}

.experience, .education {
  margin-bottom: 10px;
}

.experience h3, .education h3 {
  margin: 5px 0;
  font-size: 16px;
  color: #333;
}

.education {
  display: flex;
  justify-content: space-between;
}

.skills ul {
  list-style: none;
  padding: 0;
}

.skills ul li {
  display: inline-block;
  background: #555;
  color: #fff;
  padding: 6px 10px;
  margin: 3px 2px;
  border-radius: 20px;
  font-size: 14px;
}
`,
              style3:`
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.header h1 {
  margin: 0;
  font-size: 26px;
  color: #222;
}

.header h2 {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.contact-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.contact-info p {
  margin: 0;
}

.section {
  margin-bottom: 20px;
}

.section h2 {
  padding-bottom: 5px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.experience, .education {
  margin-bottom: 15px;
}

.experience h3, .education h3 {
  margin: 5px 0;
  font-size: 16px;
  color: #444;
}

.education {
  display: flex;
  justify-content: space-between;
}

.skills ul {
  list-style: none;
  padding: 0;
}

.skills ul li {
  display: inline-block;
  background: #222;
  color: #fff;
  padding: 5px 8px;
  margin: 3px 2px;
  border-radius: 3px;
  font-size: 14px;
}

`,
            },
            template2:{
              html: '',
              style1:'',
              style2:'',
              style3:'',
            },
            template3:{
              html: '',
              style1:'',
              style2:'',
              style3:'',
            }
          }

          const templateHtml = obj[template]['html'];

          

          // const templateStyle = templates[indexHtml][indexStyle]
          const templateStyle = obj[template][css]
          return new Function('resumeData', 'templateStyle', `return \`${templateHtml}\`;`)(resumeData, templateStyle);

}


module.exports = {

HtmlTemplate
}