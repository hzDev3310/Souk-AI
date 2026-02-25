<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
# 🇹🇳 Souk.AI - Tounes El Khadhra
**EcoMarket Connect: A Social-Commerce Marketplace for the Circular Economy.**

Souk.AI is a Laravel 12 + React marketplace designed to bridge traditional retail with modern influencer marketing, focusing on sustainability through "States of Wear" tracking.

## 🚀 Quick Start (Docker Environment)

### 1. Prerequisites
- Docker & Docker Compose
- GitHub CLI (optional)

### 2. Installation
Clone the repository and enter the folder:
```bash
git clone <your-repo-url>
cd EcoMarket


That is an essential step. Since you are using a specific Docker setup (Nginx + PHP + MySQL) and a React frontend, any other developer (or you, in 6 months) will need a clear guide to get it running.


```markdown
# 🇹🇳 Souk.AI - Tounes El Khadhra
**EcoMarket Connect: A Social-Commerce Marketplace for the Circular Economy.**

Souk.AI is a Laravel 12 + React marketplace designed to bridge traditional retail with modern influencer marketing, focusing on sustainability through "States of Wear" tracking.

## 🚀 Quick Start (Docker Environment)

### 1. Prerequisites
- Docker & Docker Compose
- GitHub CLI (optional)

### 2. Installation
Clone the repository and enter the folder:
```bash
git clone <your-repo-url>
cd EcoMarket

```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env

```

### 4. Build and Start Containers

```bash
sudo docker compose up -d --build

```

### 5. Application Setup

Run these commands to initialize the database and dependencies:

```bash
# Install PHP dependencies
docker compose exec app composer install

# Generate App Key
docker compose exec app php artisan key:generate

# Run Migrations
docker compose exec app php artisan migrate

# Install and Compile Frontend
docker compose exec app npm install
docker compose exec app npm run dev

```

## 🎨 Branding & Identity

* **Primary Color:** Deep Emerald Green (#0F5132) - *Sustainability & Tunisia*
* **Secondary Color:** Fresh Green (#198754) - *Growth*
* **AI Accent:** Intelligent Blue (#2563EB) - *Innovation*

## 🛠 Tech Stack

* **Backend:** Laravel 12 (PHP 8.4)
* **Frontend:** React + Tailwind CSS
* **Database:** MySQL 8.0
* **Server:** Nginx
* **Containerization:** Docker

## 🤖 AI Agent Features (Planned)

* Semantic Product Search
* Automated "State of Wear" Analysis
* Tunisian Derja Translation for Descriptions
* Influencer Lead Generation Insights

```

*Save and exit (Ctrl+O, Enter, Ctrl+X).*

---

### 3. Push the documentation to GitHub
Now, let's make sure GitHub shows this beautiful guide on your repo's front page:

```bash
git add README.md
git commit -m "docs: add installation guide and project overview"
git push

```

---

### 4. Next Step: The Product Model

Now that the project is documented and backed up, let's create the core of your marketplace. Based on your PDF (Page 2), we need to create the **Product** model with the specific fields for the circular economy.

Run this command to create the model, migration, and controller all at once:

```bash
docker compose exec app php artisan make:model Product -mc

```

