# 🚀 Portfolio API Server

This is a simple backend API server for managing portfolio data like **Projects**, **Skills**, and **Blogs**.

---

## 📦 Tech Stack

- Node.js
- Express.js
- JSON data or any database (e.g., MongoDB, SQLite)

---

## 📂 Available API Routes

### 🔧 Skills

- `GET /skills` – Fetch all skills  
- `POST /skills` – Add a new skill  
- `PUT /skills/:id` – Update a skill  
- `DELETE /skills/:id` – Delete a skill

---

### 💼 Projects

- `GET /projects` – Fetch all projects  
- `POST /projects` – Add a new project  
- `PUT /projects/:id` – Update a project  
- `DELETE /projects/:id` – Delete a project

---

### 📝 Blogs

- `GET /editor-content` – Fetch all blog posts  
- `POST /editor-content` – Create a blog post  
- `PUT /editor-content/:id` – Update a blog post  
- `DELETE /editor-content/:id` – Delete a blog post

---

## ▶️ Running the Server

```bash
npm install
nodemon index.js
```
