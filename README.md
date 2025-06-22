AI Resume Analyzer
A web-based application that utilizes NLP and AI algorithms to extract key information from uploaded resumes, evaluate ATS (Applicant Tracking System) compatibility, and assign a resume score based on keyword relevance and formatting.
Features

Resume Information Extraction: Extracts essential details such as name, contact information, education, work experience, and skills using NLP techniques.
ATS Friendliness Analysis: Assesses resumes for ATS compatibility by analyzing keywords, formatting, and structure, providing an ATS score.
User-Friendly Interface: Upload resumes in PDF format and view extracted data and ATS analysis in a clean, responsive UI.
Scoring System: Assigns a score to the resume based on content quality, keyword alignment, and formatting.

Technologies Used

Backend: Node.js for server-side logic and API development.
Frontend: React.js for building a dynamic and responsive user interface.
Database: MongoDB for storing user data and parsed resume information.
NLP Libraries:
SpaCy for natural language processing and entity extraction.
pdf2json for parsing PDF resumes into JSON format.


Other Tools:
Express.js for handling HTTP requests.
Tailwind CSS for styling the frontend.



Installation

Clone the Repository:
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer


Install Dependencies:

Backend:cd backend
npm install


Frontend:cd frontend
npm install




Set Up Environment Variables:

Create a .env file in the backend directory with the following:MONGO_URI=your_mongodb_connection_string
PORT=5000




Run the Application:

Start the backend server:cd backend
npm start


Start the frontend:cd frontend
npm start


The application should now be running at http://localhost:3000.



Usage

Upload a resume in PDF format via the web interface.
View extracted information such as personal details, skills, and experience.
Check the ATS compatibility score and overall resume score.
Use the feedback to optimize your resume for better job application success.

Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.
License
This project is licensed under the MIT License.
