# Enterprise LMS - Learning Management System

A modern, enterprise-grade Learning Management System built with React and Django.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (optional, SQLite used by default for development)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed sample data
python manage.py seed_content

# Start server
python manage.py runserver
```

Backend runs at: http://127.0.0.1:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: http://localhost:5173

## 📚 Features

- **Authentication**: JWT-based auth with role management (Admin/Learner)
- **Module Management**: Create, assign, and track training modules
- **Video Player**: Embedded YouTube videos and external resource support
- **Quizzes**: Automated assessments with scoring
- **Notes**: Per-module note-taking functionality
- **Analytics**: Real-time progress tracking
- **Admin Dashboard**: Complete administrative control panel

## 🏗️ Tech Stack

### Frontend
- React 18
- Vite 5
- TailwindCSS 3
- React Router v6
- Axios
- Recharts (Analytics)

### Backend
- Django 5
- Django REST Framework
- PostgreSQL / SQLite
- JWT Authentication
- Gunicorn

## 📁 Project Structure

```
LMS/
├── backend/           # Django REST API
│   ├── apps/         # Django apps (modules, quiz, auth, etc.)
│   ├── config/       # Django settings
│   └── requirements.txt
├── frontend/         # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
└── docker-compose.yml
```

## 🔒 Security

- JWT token authentication
- Password hashing (PBKDF2)
- CORS configuration
- CSRF protection
- Environment-based configuration

## 🧪 Testing

Backend:
```bash
cd backend
python manage.py test
```

Frontend:
```bash
cd frontend
npm run test
```

## 📦 Production Deployment

See [deployment documentation](./docs/DEPLOYMENT.md) for Docker and AWS deployment instructions.

## 🤝 Contributing

This is an enterprise internal project. For access or questions, contact the development team.

## 📄 License

Proprietary - All Rights Reserved
