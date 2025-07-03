# 📝 TodoListify – Nodewave Front End Assessment

This is a simple Todo Web Application built with **Next.js** and **TypeScript**, styled using **Material UI (MUI)**. The app connects with the public API provided by Nodewave and supports user authentication and todo management features.

## 🔗 Live Demo

[https://todolistify-ruby.vercel.app]

## 📁 Features

### ✅ Mandatory Features:
- [x] **Register** (create a new user)
- [x] **Login** (with JWT authentication)
- [x] **Get All Todos** (paginated + filtered)
- [x] **Create New Todo**
- [x] **Mark Todo as Done / Undone**
- [x] **Delete Selected Todos**

### 🔍 Optional Features:
- [x] **Search Todo by Keyword**
- [x] **Filter Todo by Status**
- [x] **Admin Page** to:
  - View all todos from all users
  - Search and filter by user or status
  - Paginate through todos

## 💻 Tech Stack

| Tool            | Description                         |
|-----------------|-------------------------------------|
| Next.js + TS    | App Framework                       |
| Material UI     | UI Component Library                |
| Axios           | HTTP Client                         |
| jwt-decode      | Decode JWT token                    |
| Vercel          | Deployment Platform                 |

## 📦 Installation

```bash
# Clone the repository
git clone [https://github.com/elsasalsa/todo-app.git]
cd todo-app

# Install dependencies
npm install

# Run the development server
npm run dev

⚙️ Environment Variables
Create a .env.local file and configure:
NEXT_PUBLIC_API_BASE_URL=https://fe-test-api.nwappservice.com

## 📸 Screenshots

### 📝 Register Page  
![alt text](https://github.com/elsasalsa/todo-app/blob/main/public/screenshots/register.png?raw=true)

### 🔐 Login Page  
![alt text](https://github.com/elsasalsa/todo-app/blob/main/public/screenshots/login.png?raw=true)

### ✅ Todo Dashboard  
![alt text](https://github.com/elsasalsa/todo-app/blob/main/public/screenshots/todo.png?raw=true)

### 🛠️ Admin Panel
![alt text](https://github.com/elsasalsa/todo-app/blob/main/public/screenshots/admin.png?raw=true)


🔐 Admin Credentials (for demo)
Email    : admin@nodewave.id
Password : admin123

🚀 Deployment
The app is deployed on Vercel:
👉 https://todolistify-ruby.vercel.app

👥 Collaborators
The GitHub repo is private and invited users:
-rigenski
-rizqyep
