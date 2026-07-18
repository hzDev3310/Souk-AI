SHELL := /bin/bash

.PHONY: help install runlive down restart logs shell status clean

GREEN  := \033[0;32m
YELLOW := \033[1;33m
CYAN   := \033[0;36m
RED    := \033[0;31m
NC     := \033[0m

COMPOSE := docker compose
EXEC    := $(COMPOSE) exec app

help:
	@echo ""
	@echo "  Souk-AI — Available targets"
	@echo "  ────────────────────────────────────────"
	@echo "  make install      Bootstrap the project (build + deps + migrate)"
	@echo "  make runlive      Start live dev environment (Vite HMR + queues)"
	@echo "  make down         Stop all containers"
	@echo "  make restart      Restart all containers"
	@echo "  make logs         Tail container logs"
	@echo "  make shell        Open a bash shell inside the app container"
	@echo "  make status       Show running container status"
	@echo "  make clean        Stop containers and remove volumes"
	@echo ""

# ──────────────────────────────────────────────
#  Install — full bootstrap from scratch
# ──────────────────────────────────────────────
install:
	@set -e; \
	echo -e "$(CYAN)"; \
	echo "╔══════════════════════════════════════╗"; \
	echo "║       Souk-AI — Install Script       ║"; \
	echo "╚══════════════════════════════════════╝"; \
	echo -e "$(NC)"; \
	if [ ! -f .env ]; then \
		echo -e "$(YELLOW)[1/8] Copying .env.example → .env$(NC)"; \
		cp .env.example .env; \
		echo -e "$(GREEN)      ✔ .env created$(NC)"; \
	else \
		echo -e "$(GREEN)[1/8] .env already exists, skipping.$(NC)"; \
	fi; \
	echo -e "$(YELLOW)[2/8] Building Docker images...$(NC)"; \
	$(COMPOSE) build; \
	echo -e "$(GREEN)      ✔ Images built$(NC)"; \
	echo -e "$(YELLOW)[3/8] Starting Docker containers...$(NC)"; \
	$(COMPOSE) up -d; \
	echo -e "$(GREEN)      ✔ Containers are up$(NC)"; \
	echo -e "$(YELLOW)[4/8] Waiting for MySQL to be ready...$(NC)"; \
	sleep 5; \
	echo -e "$(YELLOW)[5/8] Installing PHP dependencies (Composer)...$(NC)"; \
	$(EXEC) composer install; \
	echo -e "$(GREEN)      ✔ Composer install done$(NC)"; \
	echo -e "$(YELLOW)[6/8] Installing JS dependencies (npm)...$(NC)"; \
	$(EXEC) npm install; \
	echo -e "$(GREEN)      ✔ npm install done$(NC)"; \
	echo -e "$(YELLOW)[7/8] Building frontend assets...$(NC)"; \
	$(EXEC) npm run build; \
	echo -e "$(GREEN)      ✔ Frontend built$(NC)"; \
	echo -e "$(YELLOW)[8/8] Generating app key & running migrations...$(NC)"; \
	$(EXEC) php artisan key:generate --force; \
	$(EXEC) chown -R www-data:www-data /var/www/storage; \
	$(EXEC) chmod -R 775 /var/www/storage; \
	$(EXEC) php artisan migrate --force; \
	echo -e "$(GREEN)      ✔ Setup complete$(NC)"; \
	echo ""; \
	echo -e "$(CYAN)══════════════════════════════════════════$(NC)"; \
	echo -e "$(GREEN)   Installation complete!$(NC)"; \
	echo -e "$(CYAN)══════════════════════════════════════════$(NC)"; \
	echo ""; \
	echo -e "   App URL   : $(YELLOW)http://localhost:8000$(NC)"; \
	echo -e "   Vite HMR  : $(YELLOW)http://localhost:5173$(NC)"; \
	echo -e "   phpMyAdmin: $(YELLOW)http://localhost:8080$(NC)"; \
	echo ""

# ──────────────────────────────────────────────
#  Runlive — start dev environment
# ──────────────────────────────────────────────
runlive:
	@set -e; \
	echo -e "$(CYAN)"; \
	echo "╔══════════════════════════════════════╗"; \
	echo "║     Souk-AI — Dev Environment        ║"; \
	echo "╚══════════════════════════════════════╝"; \
	echo -e "$(NC)"; \
	if [ ! -f .env ]; then \
		echo -e "$(YELLOW)  .env not found — copying from .env.example$(NC)"; \
		cp .env.example .env; \
		echo -e "$(GREEN)   ✔ .env created$(NC)"; \
	fi; \
	echo -e "$(YELLOW)  Cleaning up existing processes...$(NC)"; \
	$(COMPOSE) down >/dev/null 2>&1 || true; \
	fuser -k 5173/tcp >/dev/null 2>&1 || true; \
	fuser -k 5174/tcp >/dev/null 2>&1 || true; \
	fuser -k 8000/tcp >/dev/null 2>&1 || true; \
	echo -e "$(GREEN)   ✔ Cleanup complete$(NC)"; \
	echo -e "$(YELLOW)  Starting Docker containers...$(NC)"; \
	$(COMPOSE) up -d; \
	echo -e "$(GREEN)   ✔ Containers are up$(NC)"; \
	echo -e "$(YELLOW)  Waiting for services to be ready...$(NC)"; \
	sleep 3; \
	echo ""; \
	echo -e "$(CYAN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"; \
	echo -e "   App      → $(GREEN)http://localhost:8000$(NC)"; \
	echo -e "   Vite     → $(GREEN)http://localhost:5173$(NC)"; \
	echo -e "   MySQL    → $(GREEN)localhost:3306$(NC)"; \
	echo -e "   phpMyAdmin → $(GREEN)http://localhost:8080$(NC)"; \
	echo -e "$(CYAN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"; \
	echo ""; \
	echo -e "$(YELLOW)  Installing npm dependencies...$(NC)"; \
	$(EXEC) npm install; \
	echo -e "$(GREEN)   ✔ npm install done$(NC)"; \
	echo -e "$(YELLOW)  Starting frontend (Vite HMR) + backend dev tools...$(NC)"; \
	echo -e "    Press $(RED)Ctrl+C$(NC) to stop dev servers (Docker keeps running)."; \
	echo ""; \
	$(EXEC) composer dev

# ──────────────────────────────────────────────
#  Utility targets
# ──────────────────────────────────────────────
down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

shell:
	$(EXEC) bash

status:
	$(COMPOSE) ps

clean:
	$(COMPOSE) down -v --remove-orphans
	@echo -e "$(GREEN)  Containers stopped and volumes removed.$(NC)"
