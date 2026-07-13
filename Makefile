SHELL := /bin/bash

.PHONY: help install runlive

GREEN := \033[0;32m
YELLOW := \033[1;33m
CYAN := \033[0;36m
RED := \033[0;31m
NC := \033[0m

help:
	@echo "Available targets:"
	@echo "  make install   - Bootstrap the Docker environment"
	@echo "  make runlive   - Start the live development environment"

install:
	@set -e; \
	echo -e "$(CYAN)"; \
	echo "╔══════════════════════════════════════╗"; \
	echo "║       Souk-AI — Install Script       ║"; \
	echo "╚══════════════════════════════════════╝"; \
	echo -e "$(NC)"; \
	if [ ! -f .env ]; then \
		echo -e "$(YELLOW)[1/7] Copying .env.example → .env$(NC)"; \
		cp .env.example .env; \
		echo -e "$(GREEN)      ✔ .env created$(NC)"; \
	else \
		echo -e "$(GREEN)[1/7] .env already exists, skipping.$(NC)"; \
	fi; \
	echo -e "$(YELLOW)[2/7] Starting Docker containers...$(NC)"; \
	docker compose up -d --build; \
	echo -e "$(GREEN)      ✔ Containers are up$(NC)"; \
	echo -e "$(YELLOW)[3/7] Installing PHP dependencies (Composer)...$(NC)"; \
	docker compose exec app composer install; \
	echo -e "$(GREEN)      ✔ Composer install done$(NC)"; \
	echo -e "$(YELLOW)[4/7] Installing JS dependencies (npm)...$(NC)"; \
	docker compose exec app npm install; \
	echo -e "$(GREEN)      ✔ npm install done$(NC)"; \
	echo -e "$(YELLOW)[5/7] Generating Laravel app key...$(NC)"; \
	docker compose exec app php artisan key:generate; \
	echo -e "$(GREEN)      ✔ App key generated$(NC)"; \
	echo -e "$(YELLOW)[6/7] Fixing storage folder permissions...$(NC)"; \
	docker compose exec app chown -R www-data:www-data /var/www/storage; \
	docker compose exec app chmod -R 775 /var/www/storage; \
	echo -e "$(GREEN)      ✔ Storage permissions set$(NC)"; \
	echo -e "$(YELLOW)[7/7] Running database migrations...$(NC)"; \
	docker compose exec app php artisan migrate --force; \
	echo -e "$(GREEN)      ✔ Database migrations complete$(NC)"; \
	echo ""; \
	echo -e "$(CYAN)══════════════════════════════════════════$(NC)"; \
	echo -e "$(GREEN)   ✅  Installation complete!$(NC)"; \
	echo -e "$(CYAN)══════════════════════════════════════════$(NC)"; \
	echo ""; \
	echo -e "   🌐  App URL   : $(YELLOW)http://localhost:8000$(NC)"; \
	echo -e "   ⚡  Vite HMR  : $(YELLOW)http://localhost:5173$(NC)"; \
	echo ""

runlive:
	@set -e; \
	echo -e "$(CYAN)"; \
	echo "╔══════════════════════════════════════╗"; \
	echo "║     Souk-AI — Dev Environment        ║"; \
	echo "╚══════════════════════════════════════╝"; \
	echo -e "$(NC)"; \
	if [ ! -f .env ]; then \
		echo -e "$(YELLOW)⚠  .env not found — copying from .env.example$(NC)"; \
		cp .env.example .env; \
		echo -e "$(GREEN)   ✔ .env created$(NC)"; \
	fi; \
	echo -e "$(YELLOW)🧹  Cleaning up existing processes...$(NC)"; \
	docker compose down >/dev/null 2>&1 || true; \
	fuser -k 5173/tcp >/dev/null 2>&1 || true; \
	fuser -k 5174/tcp >/dev/null 2>&1 || true; \
	fuser -k 8000/tcp >/dev/null 2>&1 || true; \
	echo -e "$(GREEN)   ✔ Cleanup complete$(NC)"; \
	echo -e "$(YELLOW)🐳  Starting Docker containers...$(NC)"; \
	docker compose up -d; \
	echo -e "$(GREEN)   ✔ Containers are up$(NC)"; \
	echo -e "$(YELLOW)⏳  Waiting for services to be ready...$(NC)"; \
	sleep 3; \
	echo ""; \
	echo -e "$(CYAN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"; \
	echo -e "   🌐  App      → $(GREEN)http://localhost:8000$(NC)"; \
	echo -e "   ⚡  Vite     → $(GREEN)http://localhost:5173$(NC)"; \
	echo -e "   🗄️  MySQL    → $(GREEN)localhost:3306$(NC)"; \
	echo -e "$(CYAN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"; \
	echo ""; \
	echo -e "$(YELLOW)🚀  Starting frontend (Vite HMR) + backend dev tools...$(NC)"; \
	echo -e "    Press $(RED)Ctrl+C$(NC) to stop dev servers (Docker keeps running)."; \
	echo ""; \
	docker compose exec app composer dev
