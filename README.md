📌 Google Form Clone
A simple web-based Google Form Clone built with TypeScript, HTML, CSS, and LocalStorage to create, preview, and submit dynamic forms.

📜 Features
✅ Create Dynamic Forms – Users can add text, radio, and checkbox fields.
✅ Save Forms Locally – Forms are stored in localStorage.
✅ Form Preview Mode – Users can preview how the form looks before submission.
✅ Submit Form Responses – Users can submit responses, and they are saved.
✅ View Submitted Responses – View responses in the console in tabular format.
✅ Delete Forms & Responses – Remove unwanted forms and their associated data.

📂 Folder Structure

google-form-clone/
├── dist/                      # Compiled JavaScript & Deployment Files
│   ├── index.html             # Main UI
│   ├── form-details.html      # Form Preview UI
│   ├── app.js                 # Main Script (Compiled from TypeScript)
│   ├── styles.css             # Styling for UI
│   ├── storage/
│   │   ├── localStorageHelper.js   # Handles Local Storage Operations
│   ├── interfaces/
│   │   ├── form.interface.js       # TypeScript Interfaces
│   ├── utils/
│   │   ├── utils.js                # Utility Functions
│
├── src/                      # Source Code
│   ├── app.ts                 # Main Logic (TypeScript)
│   ├── form-details.ts        # Handles Form Preview Logic
│   ├── storage/
│   │   ├── localStorageHelper.ts   # Handles Local Storage
│   ├── interfaces/
│   │   ├── form.interface.ts       # TypeScript Interfaces
│   ├── utils/
│   │   ├── utils.ts                # Utility Functions
│
├── package.json               # Dependencies & Scripts
├── tsconfig.json              # TypeScript Configuration
├── vercel.json                # Vercel Deployment Configuration
├── README.md                  # Project Documentation


🚀 Getting Started

1️⃣ Clone the Repository
git clone https://github.com/nsawant1992/google-form-clone.git
cd google-form-clone

2️⃣ Install Dependencies
npm install

3️⃣ Build the Project
npm run build
📌 This compiles TypeScript (src/) into JavaScript (dist/)

4️⃣ Start the Local Server
npm start

🛠 Deployment
This project is deployed using Vercel.

🔧 Tech Stack
TypeScript – Main logic for form creation & submission
HTML + CSS – UI structure & styling
JavaScript (ES6+) – Handles frontend logic
LocalStorage API – Persists form data locally
Vercel – Deployment platform


🚀 README.md for Your Google Form Clone Project
Create a README.md file in your project's root directory with the following content:

📌 Google Form Clone
A simple web-based Google Form Clone built with TypeScript, HTML, CSS, and LocalStorage to create, preview, and submit dynamic forms.

📜 Features
✅ Create Dynamic Forms – Users can add text, radio, and checkbox fields.
✅ Save Forms Locally – Forms are stored in localStorage.
✅ Form Preview Mode – Users can preview how the form looks before submission.
✅ Submit Form Responses – Users can submit responses, and they are saved.
✅ View Submitted Responses – View responses in the console in tabular format.
✅ Delete Forms & Responses – Remove unwanted forms and their associated data.

📂 Folder Structure
php
Copy
Edit
google-form-clone/
├── dist/                      # Compiled JavaScript & Deployment Files
│   ├── index.html             # Main UI
│   ├── form-details.html      # Form Preview UI
│   ├── app.js                 # Main Script (Compiled from TypeScript)
│   ├── styles.css             # Styling for UI
│   ├── storage/
│   │   ├── localStorageHelper.js   # Handles Local Storage Operations
│   ├── interfaces/
│   │   ├── form.interface.js       # TypeScript Interfaces
│   ├── utils/
│   │   ├── utils.js                # Utility Functions
│
├── src/                      # Source Code
│   ├── app.ts                 # Main Logic (TypeScript)
│   ├── form-details.ts        # Handles Form Preview Logic
│   ├── storage/
│   │   ├── localStorageHelper.ts   # Handles Local Storage
│   ├── interfaces/
│   │   ├── form.interface.ts       # TypeScript Interfaces
│   ├── utils/
│   │   ├── utils.ts                # Utility Functions
│
├── package.json               # Dependencies & Scripts
├── tsconfig.json              # TypeScript Configuration
├── vercel.json                # Vercel Deployment Configuration
├── README.md                  # Project Documentation
🚀 Getting Started
1️⃣ Clone the Repository
sh
Copy
Edit
git clone https://github.com/nsawant1992/google-form-clone.git
cd google-form-clone
2️⃣ Install Dependencies
sh
Copy
Edit
npm install
3️⃣ Build the Project
sh
Copy
Edit
npm run build
📌 This compiles TypeScript (src/) into JavaScript (dist/)

4️⃣ Start the Local Server
sh
Copy
Edit
npm start
📌 This runs a local server at http://localhost:8000

5️⃣ Open in Browser
bash
Copy
Edit
http://localhost:8000/dist/index.html
🛠 Deployment
This project is deployed using Vercel.

🌍 Deploy Manually
sh
Copy
Edit
vercel --prod
📌 Fix Common Vercel Issues
If dist/ is not deployed properly: 1️⃣ Update package.json:

json
Copy
Edit
"scripts": {
  "build": "tsc && cp src/*.html dist/ && cp src/*.css dist/",
  "start": "npx http-server dist/ -p 8000"
}
2️⃣ Update vercel.json:

json
Copy
Edit
{
  "builds": [{ "src": "dist/**", "use": "@vercel/static-build", "outputDirectory": "dist" }]
}
3️⃣ Commit & Redeploy:

sh
Copy
Edit
git add .
git commit -m "🚀 Fixed deployment config"
git push origin main
vercel --prod --force
🔧 Tech Stack
TypeScript – Main logic for form creation & submission
HTML + CSS – UI structure & styling
JavaScript (ES6+) – Handles frontend logic
LocalStorage API – Persists form data locally
Vercel – Deployment platform
📸 Screenshots
🎯 Home Page (Create & View Forms)

📌 Form Preview

📋 View Responses

📌 (Replace your-image-url.com with actual links from GitHub or Vercel)

🤝 Contribution Guidelines
Want to improve this project? Follow these steps: 1️⃣ Fork the repository
2️⃣ Create a new branch (git checkout -b feature-branch)
3️⃣ Commit changes (git commit -m "Added new feature")
4️⃣ Push to GitHub (git push origin feature-branch)
5️⃣ Open a Pull Request 🚀

💡 Future Enhancements
✅ CSV Export for Responses
✅ User Authentication for Form Access
✅ Drag-and-Drop Form Field Ordering
✅ Cloud Database (Firestore) Integration

👨‍💻 Author
📌 Nikhil Navinchandra Sawant
📧 Email: your-email@example.com
🔗 GitHub: github.com/nsawant1992
🔗 LinkedIn: linkedin.com/in/your-profile