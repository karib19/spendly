# Spendly — Personal Finance Tracker

Spendly is a personal finance management application designed to help users track income and expenses, manage budgets, organize transactions, and understand their spending habits through an intuitive dashboard.

The application is built with React and Django REST Framework, with PostgreSQL for data storage and JWT-based authentication.

## Live Demo

- **Frontend:** https://spendly-eight-opal.vercel.app/
- **Backend API:** https://spendly-backend-dqvq.onrender.com

> Note: The backend may take some time to respond after a period of inactivity because of the hosting service's sleep behavior.

## Features

### Dashboard
- Overview of income, expenses, and financial balance.
- Summary of financial activity.
- Charts and visual representations of spending data.

### Transaction Management
- Create, view, update, and delete transactions.
- Support for income and expense transactions.
- Transaction categories and payment methods.
- Transaction dates and descriptions.
- Search and filtering support.

### Budget Management
- Create and manage budgets.
- Organize budgets by category.
- Track spending against budget limits.

### Reports and Analytics
- Visualize financial activity with charts.
- Review income and expense patterns.
- Analyze transaction data.

### Categories
- Organize transactions using categories.
- Manage categories for financial records.

### Authentication and Security
- User registration and login.
- JWT access and refresh tokens.
- Protected application routes.
- User-specific financial data.
- Logout and token management.

### Settings and User Experience
- Responsive interface for desktop and mobile devices.
- Light and dark theme support.
- English and Bangla language support.
- Currency preferences, including BDT.
- Progressive Web App (PWA) installation support.

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Recharts
- Lucide React

### Backend
- Python
- Django
- Django REST Framework
- Django REST Framework Simple JWT
- PostgreSQL
- `django-cors-headers`

### Database and Deployment
- **Database:** Neon PostgreSQL
- **Frontend hosting:** Vercel
- **Backend hosting:** Render
- **Version control:** Git and GitHub

## Project Structure

```text
Spendly/
├── Expense_Tracker/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── pwa-192x192.png
│   │   └── pwa-512x512.png
│   ├── scripts/
│   │   └── generate-pwa-icons.mjs
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── Expense_Tracker_Backend/
│   ├── accounts/
│   ├── transactions/
│   ├── budgets/
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

*The exact contents of individual folders may vary as the project evolves.*

## Getting Started

### Prerequisites

Install the following before running the application locally:

- Node.js and npm
- Python
- PostgreSQL database or a Neon PostgreSQL connection
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/karib19/spendly.git
cd spendly
```

Replace the placeholders with your actual GitHub repository URL and project folder name.

### 2. Set Up the Frontend

```bash
cd Expense_Tracker
npm install
```

Create a `.env` file inside `Expense_Tracker/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

`http://localhost:5173`

### 3. Set Up the Backend

Open a separate terminal from the project root:

```bash
cd Expense_Tracker_Backend
```

Create and activate a Python virtual environment.

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend directory and configure the required environment variables. For example:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=your_postgresql_connection_string
```

Configure Django to load these variables securely. Use your Neon PostgreSQL connection string for the database when appropriate.

Apply database migrations:

```bash
python manage.py migrate
```

Create an administrator account if needed:

```bash
python manage.py createsuperuser
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will normally be available at:

`http://127.0.0.1:8000/`

> Keep secret keys, database credentials, and other private environment variables out of GitHub. Do not commit `.env` files.

## API Overview

The backend exposes REST API endpoints for authentication and financial data management.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/accounts/register/` | Register a user |
| POST | `/api/accounts/login/` | Authenticate a user |
| POST | `/api/accounts/token/refresh/` | Refresh an access token |
| GET | `/api/accounts/me/` | Retrieve the current user |
| POST | `/api/accounts/logout/` | Log out and handle token blacklisting |
| GET | `/api/transactions/` | Retrieve transactions |
| POST | `/api/transactions/` | Create a transaction |

Additional endpoints support budgets and categories.

Protected endpoints use JWT authentication, typically through the following request header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The exact available methods and response formats depend on the backend implementation.

## Progressive Web App (PWA)

Spendly includes PWA configuration to support installation on compatible devices and browsers.

PWA assets include:

- `public/favicon.svg`
- `public/pwa-192x192.png`
- `public/pwa-512x512.png`

Build the frontend for production:

```bash
npm run build
```

The production website must use HTTPS for normal PWA installation. Installing the application does not automatically guarantee that all features work offline; offline API access and data synchronization require additional implementation.

## Deployment

### Frontend — Vercel

1. Import the frontend repository into Vercel.
2. Set the frontend root directory to `Expense_Tracker` if deploying from the combined repository.
3. Use `npm run build` as the build command.
4. Set `dist` as the output directory.
5. Configure the environment variable:

```env
VITE_API_BASE_URL=https://spendly-backend-dqvq.onrender.com/api
```

6. Deploy or redeploy the application.

### Backend — Render

1. Configure the Django backend as a web service.
2. Install the required Python dependencies.
3. Configure the production environment variables.
4. Connect the Neon PostgreSQL database.
5. Run database migrations.
6. Configure Django's allowed hosts, CORS origins, and production security settings.
7. Start the application using the configured production server command.

The frontend's deployed origin must be allowed by the backend's CORS configuration.

## Security Considerations

- Keep Django's `SECRET_KEY` and database credentials private.
- Never expose backend secrets through `VITE_` environment variables.
- Restrict CORS to trusted frontend origins.
- Disable Django debug mode in production.
- Use HTTPS for deployed traffic.
- Enforce user-level permissions for financial records.
- Validate input on both the frontend and backend.

## Future Improvements

Potential improvements include:

- More advanced spending analytics.
- Recurring transactions.
- Improved budget notifications.
- Exportable financial reports.
- More comprehensive offline support and synchronization.
- Automated tests for API endpoints and frontend workflows.

## Learning Outcomes

This project provides practical experience with:

- Building a full-stack application using React and Django REST Framework.
- Integrating a frontend with REST APIs using Axios.
- Implementing JWT authentication.
- Working with PostgreSQL and database migrations.
- Managing application state and reusable components.
- Creating responsive interfaces with Tailwind CSS.
- Deploying a frontend and backend separately.

## Author

**Sharfuddin Karib**

Junior Full-Stack Web Developer

- GitHub: https://github.com/karib19

---

**Spendly — Track your money. Understand your habits. Manage your future.**
