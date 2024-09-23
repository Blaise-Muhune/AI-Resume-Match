document.getElementById('download-resume').addEventListener('click', async () => {
    const { PDFDocument, StandardFonts, rgb } = PDFLib;

    async function createResume() {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();

        // Add a page to the document
        const page = pdfDoc.addPage([595, 842]); // A4 size in points (8.27 x 11.69 inches)

        // Embed the Helvetica font
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Define text colors
        const blackColor = rgb(0, 0, 0);
        const greyColor = rgb(0.5, 0.5, 0.5);

        // Define margins and initial Y position
        const margin = 40;
        const pageWidth = 595 - 2 * margin;
        let currentY = 780;

        // Function to draw text with wrapping
        const drawText = (text, x, y, size, font, color) => {
            const textWidth = font.widthOfTextAtSize(text, size);
            if (textWidth <= pageWidth) {
                page.drawText(text, { x, y, size, font, color });
                return y - size - 5; // Adjust Y position for next line
            }

            const words = text.split(' ');
            let line = '';
            let newY = y;

            for (const word of words) {
                const testLine = line + word + ' ';
                const testLineWidth = font.widthOfTextAtSize(testLine, size);
                if (testLineWidth > pageWidth) {
                    page.drawText(line.trim(), { x, y: newY, size, font, color });
                    line = word + ' ';
                    newY -= size + 5;
                } else {
                    line = testLine;
                }
            }

            if (line) {
                page.drawText(line.trim(), { x, y: newY, size, font, color });
                newY -= size + 5;
            }

            return newY; // Return updated Y position
        };

        // Function to draw a horizontal line
        const drawLine = (x, y, width) => {
            page.drawLine({
                start: { x, y },
                end: { x: x + width, y },
                thickness: 1,
                color: greyColor,
            });
        };

        // Contact Information
        currentY = drawText('John Doe', margin, currentY, 18, helveticaBoldFont, blackColor);
        currentY = drawText('johndoe@example.com | (123) 456-7890 | linkedin.com/in/johndoe', margin, currentY, 12, helveticaFont, greyColor);
        currentY = drawText('123 Main Street, Anytown, USA', margin, currentY - 5, 12, helveticaFont, greyColor);

        // Draw a line
        currentY -= 10;
        drawLine(margin, currentY, pageWidth);

        // Professional Summary
        currentY -= 15;
        // currentY = drawText('Experienced software engineer with a strong background in developing award-winning strategies for diverse clientele. Skilled in various programming languages and frameworks, focusing on exceptional user experiences and business growth.', margin, currentY, 10, helveticaFont, blackColor);
        currentY = drawText(response, margin, currentY, 10, helveticaFont, blackColor);

        // Draw a line
        currentY -= 10;
        drawLine(margin, currentY, pageWidth);

        // Experience
        currentY -= 15;
        currentY = drawText('Experience', margin, currentY, 14, helveticaBoldFont, blackColor);
        currentY -= 5;
        const experience = [
            {
                title: 'Software Engineer',
                company: 'Tech Company',
                period: 'Jan \'18 - Present',
                description: 'Developed and maintained web applications using JavaScript, Node.js, and React. Improved performance by 30%. Led team of 5 developers.'
            },
            {
                title: 'Junior Developer',
                company: 'Another Tech Company',
                period: 'Jun \'15 - Dec \'17',
                description: 'Assisted in web app development and provided technical support. Contributed to launch of 3 major projects. Enhanced internal tools, reducing processing time by 20%.'
            }
        ];

        experience.forEach(job => {
            currentY = drawText(`${job.title} - ${job.company} | ${job.period}`, margin, currentY, 12, helveticaBoldFont, blackColor);
            currentY = drawText(job.description, margin, currentY - 5, 10, helveticaFont, blackColor);
            currentY -= 10;
        });

        // Draw a line
        currentY -= 10;
        drawLine(margin, currentY, pageWidth);

        // Education
        currentY -= 15;
        currentY = drawText('Education', margin, currentY, 14, helveticaBoldFont, blackColor);
        currentY -= 5;
        const education = [
            {
                degree: 'B.Sc. in Computer Science',
                institution: 'University of Technology',
                period: '2011 - 2015',
            }
        ];

        education.forEach(edu => {
            currentY = drawText(`${edu.degree} - ${edu.institution} | ${edu.period}`, margin, currentY, 12, helveticaBoldFont, blackColor);
            currentY -= 10;
        });

        // Draw a line
        currentY -= 10;
        drawLine(margin, currentY, pageWidth);

        // Personal Projects
        currentY -= 15;
        currentY = drawText('Personal Projects', margin, currentY, 14, helveticaBoldFont, blackColor);
        currentY -= 5;
        const projects = [
            {
                title: 'Project A',
                description: 'Full-stack web app using MERN stack. Helps users track daily tasks and manage projects.'
            },
            {
                title: 'Project B',
                description: 'Mobile app using React Native for real-time weather updates.'
            }
        ];

        projects.forEach(project => {
            currentY = drawText(`${project.title} - ${project.description}`, margin, currentY, 12, helveticaFont, blackColor);
            currentY -= 10;
        });

        // Draw a line
        currentY -= 10;
        drawLine(margin, currentY, pageWidth);

        // Certifications
        currentY -= 15;
        currentY = drawText('Certifications', margin, currentY, 14, helveticaBoldFont, blackColor);
        currentY -= 5;
        const certifications = [
            'Certified JavaScript Developer, AWS Certified Solutions Architect, Certified Scrum Master, Google Analytics Certified, Certified Ethical Hacker'
        ];

        certifications.forEach(cert => {
            currentY = drawText(cert, margin, currentY, 10, helveticaFont, blackColor);
            currentY -= 10;
        });

        // Draw a line
        currentY -= 10;
        drawLine(margin, currentY, pageWidth);

        // Languages
        currentY -= 15;
        currentY = drawText('Languages', margin, currentY, 14, helveticaBoldFont, blackColor);
        currentY -= 5;
        const languages = [
            'English (Native), Spanish (Fluent), French (Intermediate), German (Basic)'
        ];

        languages.forEach(lang => {
            currentY = drawText(lang, margin, currentY, 10, helveticaFont, blackColor);
            currentY -= 10;
        });

        // Draw a line
        currentY -= 10;
        drawLine(margin, currentY, pageWidth);

        // Skills
        currentY -= 15;
        currentY = drawText('Skills', margin, currentY, 14, helveticaBoldFont, blackColor);
        currentY -= 5;
        const skills = 'JavaScript, Node.js, React, HTML, CSS, SQL, Git, Agile Methodologies, Docker, Kubernetes, AWS, Azure, Python, Java, C#, REST APIs, GraphQL, Microservices, TDD, BDD';
        currentY = drawText(skills, margin, currentY, 10, helveticaFont, blackColor);

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // Create a blob from the PDF bytes
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Create a link element
        const link = document.createElement('a');

        // Set the download attribute with a filename
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'resume.pdf';

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
    }

    createResume().then(() => {
        console.log('Resume created successfully.');
    }).catch(err => {
        console.error('Error creating resume:', err);
    });
});

