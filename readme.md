# ⚡️ React Todo List

A production-ready Todo application built with React, TypeScript, and modern web technologies. Features a beautiful UI, authentication, and real-time updates.

## ✨ Features

- 🔐 User authentication (sign up/sign in)
- ✅ Create, read, update, and delete todos
- 📅 Due date tracking
- 🌓 Dark/light mode
- 🎯 Mark todos as complete
- 🔔 Toast notifications
- 📱 Responsive design
- 🧪 Comprehensive test coverage

## 🚀 Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- shadcn/ui
- Vite
- Vitest

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Add environment variables in .env file: Create a .env file at the root of your project (if it doesn't already exist), and add the following:
```bash
VITE_API_URL=<your-api-url>
```
Replace <your-api-url> with the URL of the backend API (e.g., https://your-backend-url.com).
You can clone backend from this.(https://github.com/eross220/every-vote-backend-test)


4. Start the development server:
```bash
npm run dev
```

## 🧪 Testing

Run the test suite:
```bash
# Run tests in watch mode
npm test

# Generate coverage report
npm run coverage
```

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 📝 Usage

1. **Authentication**
   - Sign up with email and password
   - Sign in with existing credentials
   - Logout functionality

2. **Todo Management**
   - Create new todos with title, description, and due date
   - Mark todos as complete/incomplete
   - Edit existing todos
   - Delete todos
   - View all todos in a clean interface

3. **Theme**
   - Toggle between light and dark mode
   - System preference detection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop
- Tablet
- Mobile devices

## 🔒 Security

- Protected routes for authenticated users
- Secure authentication flow
- Form validation
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

