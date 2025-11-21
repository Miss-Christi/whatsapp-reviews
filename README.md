📱 WhatsApp Product Reviews App

A full-stack integration that captures real-time product reviews through a **WhatsApp Chatbot** and displays them on a **Live React Dashboard**.

🚀 Live Demo
**Frontend Dashboard:** [Click here to view Reviews](https://YOUR-VERCEL-URL.vercel.app)
**Backend API:** [Click here to view JSON Data](https://YOUR-RENDER-URL.onrender.com/api/reviews)

⚙️ How It Works
1.  **Submission:** A user chats with the bot on WhatsApp (powered by Twilio).
2.  **Processing:** The Python Backend (FastAPI) manages the conversation flow (Product -> Name -> Review).
3.  **Storage:** Data is saved instantly to a Cloud PostgreSQL Database (Neon/Render).
4.  **Display:** The React Frontend polls the API and updates the dashboard in real-time.

🛠️ Tech Stack
* **Frontend:** React.js, CSS (Deployed on **Vercel**)
* **Backend:** Python, FastAPI, SQLAlchemy (Deployed on **Render**)
* **Database:** PostgreSQL (Neon.tech)
* **Integration:** Twilio WhatsApp API

📂 Project Structure
whatsapp-reviews/
├── backend/
│   ├── main.py          # API & Bot Logic
│   └── requirements.txt
├── frontend/
│   ├── src/             # React UI Code to see the reviews
│   └── package.json
└── README.md


 🔗 Link 1: To View Reviews (Public)
**URL:** `https://<your-project-name>.vercel.app`

🔗 Link 2: To Submit Reviews (The WhatsApp Bot)
*Since I am using the **Twilio Sandbox** (Free Tier), it doesn't jusy allow anyone to message your bot. You must "Join" the sandbox first.*

**Steps to Join the Sandbox:**
1.  "Save this phone number: **+1 415 523 8886** (Twilio Sandbox)"
2.  "Send a WhatsApp message to that number with the code: join <dot-would>"
3.  "Once it replies, send the message: *Hi*"
