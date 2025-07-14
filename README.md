# ToDo App with Authentication

A modern, responsive ToDo application built with React + Vite, featuring Google OAuth and JWT authentication.

## 🚀 Features

- **Authentication**
  - Email/password login and registration
  - Google OAuth integration
  - JWT token management with automatic refresh
  - Email confirmation system
  - Protected routes

- **Todo Management**
  - Create, edit, delete todos
  - Mark todos as completed/pending
  - Priority levels (Low, Medium, High)
  - Due dates
  - Search and filter functionality
  - Responsive design

- **UI/UX**
  - Modern design with Tailwind CSS
  - shadcn/ui components
  - Fully responsive (mobile, tablet, desktop)
  - Smooth animations and transitions
  - Toast notifications

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **State Management:** Zustand
- **HTTP Client:** Axios
- **UI Framework:** Tailwind CSS + shadcn/ui
- **Authentication:** @react-oauth/google
- **Routing:** React Router DOM
- **Date Handling:** date-fns

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your Google OAuth client ID in `.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `VITE_AUTH_API_URL`: Authentication backend URL (default: http://localhost:8080)
- `VITE_TODO_API_URL`: Todo backend URL (default: http://localhost:8081)

### Backend Requirements

The app expects two Spring Boot backends:

#### Auth Backend (Port 8080)
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - User registration
- `POST /api/auth/oauth/google` - Google OAuth login
- `GET /api/auth/confirm` - Email confirmation
- `POST /api/auth/refresh` - Token refresh

#### Todo Backend (Port 8081)
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes with authentication guards
- CORS-enabled API calls
- Secure token validation

## 🎨 UI Components

Built with shadcn/ui components:
- Forms with validation
- Responsive dialogs and modals
- Toast notifications
- Tabs and filtering
- Cards and layouts
- Buttons and inputs

## 📄 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # App header
│   ├── PrivateRoute.tsx # Route protection
│   └── TodoCard.tsx    # Todo item component
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Todos.tsx       # Todo management page
│   └── EmailConfirmation.tsx # Email confirmation
├── services/           # API services
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication API
│   └── todoService.js  # Todo API
├── store/              # State management
│   └── authStore.js    # Zustand auth store
└── App.tsx             # Main app component
```

## 🚦 Getting Started

1. Ensure both backend services are running
2. Configure Google OAuth credentials
3. Start the development server
4. Navigate to `http://localhost:5173`
5. Register a new account or login with Google
6. Start managing your todos!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.