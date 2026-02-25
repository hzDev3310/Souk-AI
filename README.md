# 🇹🇳 Souk.AI - EcoMarket Connect

**EcoMarket Connect: A Social-Commerce Marketplace for the Circular Economy.**

Souk.AI is a premium marketplace designed to bridge traditional retail with modern influencer marketing, focusing on sustainability through "States of Wear" tracking and AI-powered insights.

---

## 🌿 Vision & Purpose

Souk.AI (Tounes El Khadhra) empowers users to participate in a sustainable circular economy. By combining the power of **Laravel 12** and **React**, we provide a seamless, high-performance experience for buyers, sellers, and influencers.

### 🤖 AI-Powered Features (Planned)
*   **Automated "State of Wear" Analysis:** Computer vision to detect product condition from images.
*   **Semantic Product Search:** Find exactly what you need using natural language.
*   **Tunisian Derja Translation:** Localized experience for the Tunisian market with smart translation.
*   **Influencer Lead Generation:** Strategic insights for brand partnerships.

---

## 🎨 Branding & Identity

Our identity is rooted in growth, trust, and Tunisia's green future.

| Element | Color | Hex | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Emerald Green | `#0F5132` | Sustainability, Growth, Tunisia |
| **Secondary** | Fresh Green | `#198754` | Success states, Highlights, Buttons |
| **Accent** | Intelligent Blue | `#2563EB` | AI, Technology, Innovation |
| **Background**| Soft White | `#F8F9FA` | Clean Marketplace Feel |
| **Premium** | Dark Mode | `#111827` | High-tech Startup Appearance |

---

## 🛠 Tech Stack

*   **Backend:** Laravel 12 (PHP 8.4)
*   **Frontend:** React + Tailwind CSS v4
*   **Database:** MySQL 8.0
*   **Infrastructure:** Docker (Nginx, PHP-FPM, MySQL)
*   **Build Tool:** Vite

---

## 🚀 Quick Start (Docker Environment)

### 1. Requirements
*   Docker & Docker Compose installed.

### 2. Setup
```bash
# Clone the project
git clone <your-repo-url>
cd EcoMarket

# Initialize environment
cp .env.example .env

# Build components
sudo docker compose up -d --build
```

### 3. Run the Project
We use a Docker-optimized command to run everything in one go:
```bash
# This starts Vite (React/Tailwind), Queues, and Logs inside the container
sudo docker compose exec app composer dev
```

### � Accessing the App
*   **Main Site:** [http://localhost:8000](http://localhost:8000)
*   **React Demo:** [http://localhost:8000/example-react](http://localhost:8000/example-react)
*   **Blade Demo:** [http://localhost:8000/example-blade](http://localhost:8000/example-blade)

---

## 📂 Project Structure

*   `app/Models`: Business logic and Circular Economy data structures.
*   `resources/js`: React components and application logic.
*   `resources/views`: Laravel Blade templates and React entry points.
*   `docker-config`: Nginx and server configuration.

---

## 🤝 Contributing

We welcome contributions to help build Tunisia's green digital future. Please ensure your code follows the established branding and Tailwind v4 guidelines.

**© 2026 EcoMarket Connect - Souk.AI**
