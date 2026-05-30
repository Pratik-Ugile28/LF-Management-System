# 🚀 LF Project – Full Stack Social Media Platform 🌐

Welcome to the **LF Project** – a full-fledged, dynamic **social media platform** built using the **MERN stack** (MongoDB, Express, React, Node.js). This project blends powerful backend services with a sleek, responsive frontend to deliver an awesome user experience.

---

## 🧰 Tech Stack

**Frontend** 🖥️  
- ⚛️ React (v17.0.2)  
- 🎨 Bootstrap 4 + React-Bootstrap  
- 🔄 Axios for API calls  
- 🧭 React Router  
- 🎉 AOS (Animate on Scroll), Carousel, Toast Notifications  

**Backend** 🛠️  
- 🧠 Node.js + Express  
- 🗄️ MongoDB with Mongoose  
- 🛡️ Passport.js + JWT Auth  
- ☁️ AWS S3 file uploads (via multer-s3)  
- 📬 Mailgun / SMTP email service  
- 🍪 cookie-session + CORS  

---

## ✨ Features

- 🔐 **Secure JWT Authentication** (Login & Registration)  
- 🗃️ **Category Management API**  
- 📸 **Image Upload to AWS S3**  
- 🌐 **Fully Responsive UI**  
- 🧼 **Clean Code & Organized Structure**  
- 🛎️ **Toast Notifications** for Real-time Feedback  
- 🎯 **Client-Server Separation** for Scalable Development

---

## 📁 Project Structure

```
LF-project/
├── lfs-backend-server-master/   # ⚙️ Express + MongoDB API
│   ├── routes/                  # 🔁 Auth & Category Endpoints
│   ├── models/                  # 🧬 Mongoose Models
│   ├── uploads/                 # 📦 Static File Storage
│   └── server.js                # 🚀 API Entry Point
├── lfs-frontend-master/         # 🖥️ React Frontend SPA
│   ├── src/                     # 🧱 Components, Pages, Assets
│   └── public/                  # 🌐 Static Files
└── README.md                    # 📖 This File
```

---

## 🔧 Getting Started

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/shekharider/LF-project.git
cd LF-project
```

### 2️⃣ Setup Backend 🔙

```bash
cd lfs-backend-server-master
npm install
copy .env.example .env
# Edit .env and set your JWT_SECRET, MONGODB_URI, AWS S3 & Mailgun/SMTP credentials
npm start
```

### 3️⃣ Setup Frontend 🔜

```bash
cd ../lfs-frontend-master
npm install
npm start
```

### ✅ Now Open

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

---

## 🧪 Run Tests

```bash
# Backend
cd lfs-backend-server-master
npm test

# Frontend
cd ../lfs-frontend-master
npm test
```

---

## 🌍 Environment Variables (Backend)

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret for JWT |
| `MONGODB_URI` | MongoDB connection string |
| `AWS_ACCESS_KEY_ID` | AWS access key ID for S3 uploads |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key for S3 uploads |
| `AWS_S3_BUCKET_NAME` | AWS S3 bucket name for uploaded files |
| `AWS_REGION` | AWS region for S3 storage |
| `MAILGUN_API_KEY` | Mailgun API key |
| `MAILGUN_DOMAIN` | Mailgun domain |
| `MAIL_FROM` | Sender email address for outgoing mail |
| `SMTP_HOST` | SMTP host for fallback email sending |
| `SMTP_PORT` | SMTP port, typically `587` |
| `SMTP_SECURE` | `true` for SSL/TLS, `false` for STARTTLS |
| `SMTP_USER` | SMTP username for fallback email sending |
| `SMTP_PASS` | SMTP password for fallback email sending |
| `GMAIL_USER` | Gmail address used for SMTP fallback |
| `GMAIL_PASS` | Gmail app password for SMTP fallback |

---

## 🤝 Contributing

Got ideas? Found a bug? Contributions are welcome!  

1. Fork it 🍴  
2. Create your feature branch (`git checkout -b amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some magic'`)  
4. Push to the branch (`git push origin amazing-feature`)  
5. Create a Pull Request 🚀

---

## 💡 Author

Made with ❤️ by Pratik Ugile (https://github.com/Pratik-Ugile28)
