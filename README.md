# 🛠️ Freelance Terminal

<div align="center">

### Modern Freelance Marketplace & Dynamic Task Management Platform

A high-performance full-stack marketplace web application where clients can post projects, freelancers can submit tailored proposals, and workspaces interact seamlessly.

🌐 **Live Demo:** [View FreelanceTerminal Website](https://freelance-terminal.vercel.app)

</div>

---

# 📖 Project Overview

**Freelance Terminal** is a modern and easy-to-use freelance marketplace that connects clients, freelancers, and admins in one smart platform.

* **Clients** can easily post jobs, review proposals, and make secure payments using **Stripe**.
* **Freelancers** can apply for jobs, track their applications, and manage their profiles on a smooth, fast dashboard.
* **Admins** control the whole platform by managing user accounts, checking job posts, and keeping the marketplace safe for everyone.

The platform focuses on:
- Secure role-based dashboard workspaces (Admin, Client, Freelancer)
- Automated dynamic token management using Better Auth
- High-performance parallel API operations (`Promise.all`)
- Anti-cascading render routines for a lag-free UI
- Real-time task synchronization (`cache: "no-store"`)
- Modern, scannable UX with robust layout security

This project was built using **Next.js (App Router), MongoDB, Express.js, Better Auth, Tailwind CSS, and React Hot Toast**.

---

# ✨ Key Features

## 👨‍💼 Role-Based Workflows
* **Client Hub:** Post new tasks with dynamic budgets, evaluate developer proposals, securely accept/reject bids, and process payment actions.
* **Freelancer Arena:** Explore global project pipelines, deploy tailored proposals, inspect application statuses (Pending/Accepted/Rejected), and access earnings metrics.
* **Admin Control Center:** Global command station to moderate platform activities, review overall task feeds, and manage active user state configurations.

---

## 🔒 Next-Gen Security & Architecture
* **Better Auth Integration:** Hardened session management extracting active credentials dynamically from client-side state engines.
* **JWT Middleware Guard:** Backend validation layers matching every protected route with dynamic token authentications before resolving queries.

---

## ⚡ Performance Optimizations
* **Parallel Processing:** Uses `Promise.all` to fetch data from multiple sources concurrently, reducing loading times and preventing main thread blocking.
* **No Layout Shifts:** Implements careful timeout controls and mount lifecycles to completely eliminate screen flickering and unexpected layout movements.

---

# 🖼️ Website Sections

## 🏠 Landing & Public Directory
* Responsive UI showcasing premium freelance features.
* Global task directory with seamless real-time search.
* Dynamic navigation mapping based on authorization levels.

---

## 💼 Client Workspace
* Interactive task creation interface.
* Dedicated proposal feedback viewer (with explicit Accept/Reject capabilities).
* Financial overview log summarizing total spending metrics.

---

## 👨‍💻 Freelancer Dashboard
* Clean summary view displaying approved contracts.
* Profile customization module (Name, Avatar, and professional Bios).
* Real-time validation logs ensuring valid user session monitoring.

---

# 🛠️ Tech Stack

## Frontend

- Next.js 16
- React.js
- Tailwind CSS
- Framer Motion
- Swiper.js
- Lucide React
- React Icons
- React Hot Toast

---

## Backend
* Node.js
* Express.js
* MongoDB
* JWT Authentication Middleware

---

## Deployment
* Vercel (Frontend Optimization Architecture)
* Vercel (High Availability Backend Hosting)

---

# 📂 Project Structure

```bash
freelance-terminal/
│
├── frontend/             # Next.js Application Node
│   ├── src/
│   │   ├── app/         # Dynamic Routes, Modals & Main Dashboards
│   │   ├── components/  # Reusable UI Blocks & Action Containers
│   │   ├── hooks/       # Session Controllers & Context Core
│   │   └── lib/         # Better Auth System Configs
│   └── .env       # Client Environment Variables
│
├── backend/              # Express Server Engine
│   ├── middleware/      # verifyToken Validation Layers
│   ├── index.js         # API Handlers & MongoDB Intersections
│   └── .env             # Secure Database Connection Keys
│
└── README.md             # Global Platform Documentation

```

---

# ⚙️ Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/remon918/Freelance-Terminal.git
```

---

## 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 3️⃣ Backend Setup

```bash
cd server
npm install
npm start
```

---
# 🔗 API Endpoints

## 📚 Tasks Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/tasks` | Creates a new marketplace project |
| GET | `/api/freelancer` | Get featured freelancer |
| GET | `/api/my-tasks` | Fetches active projects posted by client |
| GET | `/api/tasks/:taskId` | Resolves single comprehensive task detail |

---

## 📅 Proposals Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| PUT | `/api/proposals/:taskId/:proposalId` | Modifies bid states (Accept/Reject operations) |
| GET | `/api/proposals/details/:proposalId` | Returns granular metadata for single proposal |


---

## 👨‍🏫 Profile & Analytics Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/clients/:id` | Loads basic bio data for client view |
| PUT | `/api/clients/:id` | Updates user details (Name, Bio, Profile Image) |
| GET | `/api/payment-history` | Computes historical transactions & total expenditures |



---

# 🚀 Future Improvements

- More Admin Control Features
- Real-Time Messaging & Chat System between Clients and Freelancers
- Project Milestone Tracking and Task Progress Status
- AI-Powered Smart Proposal and Job Matching System
- User Verification Badges & Review Rating Matrix


---


# 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Push to GitHub  
5. Create a Pull Request  

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

### Developed by: Remon Hossen

- GitHub: https://github.com/remon918
- LinkedIn: https://www.linkedin.com/in/remon-hossen

---

# 💬 Support

If you like this project, consider giving it a ⭐ on GitHub.

📧 mdremonhossen7778@gmail.com

---

<div align="center">

## ⭐ Thank You For Visiting FreelanceTerminal ⭐

### Empowering Learning Through Smart Freelance Workspace

</div>
