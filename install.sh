#!/bin/bash

set -e

# ─────────────────────────────────────────────
#  Souk-AI — Docker Install Script
# ─────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════╗"
echo "║        Souk-AI — Install Script      ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# ── Step 1: Copy .env if missing ──────────────
if [ ! -f .env ]; then
  echo -e "${YELLOW}[1/5] Copying .env.example → .env${NC}"
  cp .env.example .env
  echo -e "${GREEN}      ✔ .env created${NC}"
else
  echo -e "${GREEN}[1/5] .env already exists, skipping.${NC}"
fi

# ── Step 2: Start Docker containers ──────────
echo -e "${YELLOW}[2/5] Starting Docker containers...${NC}"
docker compose up -d --build
echo -e "${GREEN}      ✔ Containers are up${NC}"

# ── Step 3: Install PHP dependencies ─────────
echo -e "${YELLOW}[3/5] Installing PHP dependencies (Composer)...${NC}"
docker compose exec app composer install
echo -e "${GREEN}      ✔ Composer install done${NC}"

# ── Step 4: Install JS dependencies ──────────
echo -e "${YELLOW}[4/5] Installing JS dependencies (npm)...${NC}"
docker compose exec app npm install
echo -e "${GREEN}      ✔ npm install done${NC}"

# ── Step 5: Generate app key ──────────────────
echo -e "${YELLOW}[5/5] Generating Laravel app key...${NC}"
docker compose exec app php artisan key:generate
echo -e "${GREEN}      ✔ App key generated${NC}"

echo ""
echo -e "${CYAN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅  Installation complete!${NC}"
echo -e "${CYAN}══════════════════════════════════════════${NC}"
echo ""
echo -e "  🌐  App URL   : ${YELLOW}http://localhost:8000${NC}"
echo -e "  ⚡  Vite HMR  : ${YELLOW}http://localhost:5173${NC}"
echo ""
