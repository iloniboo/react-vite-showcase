# ⚡️ React Todo List

A production-ready Todo application built with **React**, **TypeScript**, and modern web technologies. Designed with elegant UI, real-time updates, and robust authentication.

## ✨ Features

- 🔐 Auth: Sign up / Sign in / Logout
- ✅ Full CRUD for Todos
- 📅 Due date tracking
- 🌗 Dark / Light mode toggle
- 🎯 Mark todos as complete/incomplete
- 🔔 Toast notifications for actions
- 📱 Fully responsive design
- 🧪 Unit tests + coverage

## 🧰 Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- shadcn/ui
- Vite
- Vitest

## 📁 Project Structure

```
src/
├── components/       # UI & form elements
├── features/         # Todo & auth logic (Redux slices, hooks)
├── pages/            # Main views (Home, Auth)
├── routes/           # Protected route logic
├── styles/           # Tailwind config & global styles
└── utils/            # API helpers, validation, etc.
```

## ⚙️ Setup & Development

### Prerequisites

- Node.js >= 16
- npm or yarn

### Install dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file at the project root:

```env
VITE_API_URL=https://your-backend-url.com
```

👉 You can clone the backend from [this repo](https://github.com/iloniboo/react-vite-showcase-backend)

### Start Dev Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🧪 Testing

Run tests with coverage:

```bash
npm test        # Watch mode
npm run coverage
```

## 🛠️ Available Scripts

- `npm run dev` — Start dev server
- `npm run build` — Build production assets
- `npm test` — Run unit tests
- `npm run coverage` — Generate coverage report

## 🧭 Usage Guide

### 🔐 Authentication

- Sign up with email & password
- Sign in with existing credentials
- Logout instantly

### 📋 Todo Management

- Create todos with title, description, and due date
- Edit or delete existing todos
- Toggle completion state
- View all tasks in a clean, filterable list

### 🌓 Theming

- Toggle dark/light mode
- Auto-detect system preference

## 📱 Responsive UI

Works seamlessly across:

- 🖥 Desktop
- 📱 Mobile
- 💻 Tablets

## 🔒 Security

- Protected routes for authenticated users
- Secure auth flow with form validation
- Error boundary + fallback UI

## 🤝 Contributing

1. Fork this repo
2. Create a new branch `git checkout -b feature/amazing-feature`
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request 🚀

---

## 🧙‍♀️ Author

Built by [Ilona](https://github.com/iloniboo) ✨

## 📜 License

MIT — use it freely.
