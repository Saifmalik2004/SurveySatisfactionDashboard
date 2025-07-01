
# 🍽️ Restaurant User Satisfaction Survey Dashboard

A full-stack web application to collect, store, and analyze customer feedback for a restaurant chain.
Built with **React + TypeScript** frontend and **Spring Boot + JPA** backend connected to a **MySQL database** hosted on **Railway**.

---

## 📑 Table of Contents

* [Project Overview](#project-overview)
* [Directory Structure](#directory-structure)
* [Technologies Used](#technologies-used)
* [Setup Instructions](#setup-instructions)
* [API Endpoints](#api-endpoints)
* [Usage](#usage)
* [Screenshots](#screenshots)
* [Contributing](#contributing)
* [License](#license)

---

## 🔍 Project Overview

This dashboard allows users to submit feedback on:

* Food quality 🍲
* Service speed ⏱️
* Staff friendliness 😊
* Cleanliness 🧼
* Value for money 💰
* Ambiance 🎶

Admins can:

* Access a **password-protected dashboard** (password: `saif`)
* View tables, charts, and export data (CSV/Excel)
* Analyze responses using interactive charts

---

## 🗂️ Directory Structure

```
survey-dashboard/
├── backend/                 # Spring Boot backend
│   ├── controller/          # Controllers
│   ├── model/               # Entity classes
│   ├── dto/                 # Data Transfer Objects
│   ├── repository/          # JPA Repositories
│   ├── resources/
│   │   └── application.properties
│   └── DashboardApplication.java
├── frontend/                # React frontend
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page views
│   ├── hooks/               # Custom React hooks
│   └── App.tsx
├── screenshots/             # UI screenshots
├── db-schema.sql            # MySQL schema & sample data
└── README.md                # Project documentation
```

---

## 🧰 Technologies Used

### 🔧 Backend

* Java 17
* Spring Boot 3.x
* Spring Data JPA
* MySQL (hosted on [Railway](https://railway.app/))
* Lombok
* Maven

### 🎨 Frontend

* React 18
* TypeScript
* React Router
* React Query
* Tailwind CSS
* ShadCN UI
* Recharts
* Axios

### 🛠️ Tools

* IntelliJ IDEA
* VS Code
* Postman
* MySQL Workbench
* Git

---

## ⚙️ Setup Instructions

### 📋 Prerequisites

* Java 17
* Node.js 18+
* MySQL (local or Railway)
* Git
* Maven

---

### 🔁 Clone the Repository

```bash
git clone https://github.com/your-username/survey-dashboard.git
cd survey-dashboard
```

---

### 🚀 Backend Setup

```bash
cd backend
```

1. Configure `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://yamanote.proxy.rlwy.net:36298/railway
spring.datasource.username=root
spring.datasource.password=DGaPyWGZTuceodQlqsdvRHaftfjnGvBq
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

2. Import the schema:

```bash
mysql -h yamanote.proxy.rlwy.net -P 36298 -u root -p railway < db-schema.sql
```

3. Build and run:

```bash
mvn clean install
mvn spring-boot:run
```

📍 Backend runs at: `http://localhost:8080`

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

📍 Frontend runs at: `http://localhost:5173`

---

## 🗄️ Database Schema

```sql
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  visit_date DATE NOT NULL,
  location VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE survey_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  food_quality ENUM(...) NOT NULL,
  service_speed ENUM(...) NOT NULL,
  staff_friendliness ENUM(...) NOT NULL,
  cleanliness ENUM(...) NOT NULL,
  value_for_money ENUM(...) NOT NULL,
  ambiance ENUM(...) NOT NULL,
  overall_rating DECIMAL(2,1) NOT NULL,
  comments TEXT,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

---

## 📡 API Endpoints

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/survey`           | Submit a survey response    |
| GET    | `/api/survey/customers` | Get all customers           |
| GET    | `/api/survey/responses` | Get all survey responses    |
| GET    | `/api/customers`        | Alternate customer endpoint |

* ✅ Input Validation: `@Valid`, `@NotBlank`
* ⚠️ Error Handling: `GlobalExceptionHandler`

---

## 🧪 Usage

### 🔐 Admin Access

* Open `http://localhost:5173`
* Enter **password**: `saif`

### 📝 Submit a Survey

* Go to: `http://localhost:5173/survey`
* Fill in details and submit

### 📊 View Dashboard

* Access: `http://localhost:5173/admin-dashbaord-saif`
* Features:
  ✅ Data Table
  ✅ Bar, Pie, Line, Radar Charts
  ✅ Export to CSV / Excel

---

## 🖼️ Screenshots

> Located in the `/screenshots` folder:

| Page        | Image           |
| ----------- | --------------- |
| Home        | `home.png`      |
| Dashboard   | `dashboard.png` |
| Survey Form | `survey.png`    |
| 404 Page    | `notfound.png`  |

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes

   ```bash
   git commit -m "Add your feature"
   ```
4. Push & create PR

   ```bash
   git push origin feature/your-feature
   ```

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for details.

---
