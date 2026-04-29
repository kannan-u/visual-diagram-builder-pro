# 🧩 Visual Diagram Builder Pro

A full-stack, real-time diagram editor built with React, TypeScript, and Firebase. Create, edit, and share flowcharts with drag-and-drop simplicity — powered by React Flow and secured with Firebase Authentication.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)
![React Flow](https://img.shields.io/badge/React_Flow-11-FF0072?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-8%20passing-brightgreen?style=flat-square)

---

## ✨ Features

- **Drag-and-Drop Diagram Editor** — Intuitive node-based canvas using React Flow
- **Multiple Node Shapes** — Rectangle, Circle, Diamond, Triangle, Hexagon, Parallelogram
- **Real-Time Database** — All diagrams sync instantly via Firebase Firestore
- **Firebase Authentication** — Secure sign-up and login with role-based access
- **Protected Routes** — Unauthenticated users are redirected to login
- **Role-Based Access** — Editor and Viewer roles with different permissions
- **CRUD Operations** — Create, read, update, and delete diagrams
- **Context Menu** — Right-click to edit labels or delete nodes and edges
- **Dashboard** — Manage all saved diagrams in one place
- **Invite Users** — Share diagrams with other users via email

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript |
| Diagram Engine | React Flow 11 |
| Backend / Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Hosting | Firebase Hosting / GCP |
| Build Tool | Create React App |
| Testing | Jest, React Testing Library |

---

## 📁 Project Structure

```
visual-diagram-builder-pro/
├── public/
│   ├── Login.png
│   ├── Diagram-List.png
│   ├── Diagram.png
│   └── Edit.png
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Login.test.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── RegisterPage.test.tsx
│   │   ├── Dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── DashboardPage.test.tsx
│   │   │   └── InviteUser/
│   │   └── Diagrams/
│   │       ├── DiagramEditorPage.tsx
│   │       └── SidebarToolbox.tsx
│   ├── hooks/
│   │   └── useAuth.tsx
│   ├── services/
│   │   └── firebase.ts
│   ├── declarations.d.ts
│   └── App.tsx
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kannan-u/visual-diagram-builder-pro.git
cd visual-diagram-builder-pro

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Firebase config values in .env

# 4. Start the development server
npm start
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## 🔐 Authentication Flow

1. User registers or logs in via Firebase Auth
2. `useAuth` hook tracks authentication state and role globally
3. Protected routes redirect unauthenticated users to the login page
4. On login, editors are directed to the Dashboard with full CRUD access
5. Viewers can browse diagrams in read-only mode

---

## 📊 Firestore Data Model

```
diagrams (collection)
  └── {diagramId} (document)
        ├── name: string
        ├── ownerId: string
        ├── ownerEmail: string
        ├── nodes: Node[]
        ├── edges: Edge[]
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

---

## 📸 Screenshots

**Login Page**
![Login Page](/public/Login.png)

**Diagram List (Dashboard)**
![Diagram List](/public/Diagram-List.png)

**Diagram Canvas**
![Diagram Canvas](/public/Diagram.png)

**Diagram Editor**
![Diagram Editor](/public/Edit.png)

---

## 🧪 Testing

```bash
npm test                       # Run all tests in watch mode
npm test -- --watchAll=false   # Run all tests once
npm test -- --coverage         # Run with coverage report
```

The test suite covers:

- Login form renders correctly
- Register form renders correctly
- Dashboard loading and error states
- Component renders without crashing

---

## 🌐 Deployment

Deployed on **Firebase Hosting**:

```bash
npm run build
firebase deploy
```

**Live Demo:** [https://diagram-editor-f6b86.web.app](https://diagram-editor-f6b86.web.app)

---

## 📝 License

This project was built as an assessment for Visual Diagram Builder. All rights reserved.

---

## 👤 Author

**Kannan U**
GitHub: [@kannan-u](https://github.com/kannan-u)
