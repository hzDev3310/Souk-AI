#!/bin/bash

set -e

# ─────────────────────────────────────────────
#  Souk-AI — Start Dev Environment
# ─────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════╗"
echo "║     Souk-AI — Dev Environment        ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# ── Check .env ────────────────────────────────
if [ ! -f .env ]; then
  echo -e "${YELLOW}⚠  .env not found — copying from .env.example${NC}"
  cp .env.example .env
  echo -e "${GREEN}   ✔ .env created${NC}"
fi

# ── Start Docker containers ───────────────────
echo -e "${YELLOW}🐳  Starting Docker containers...${NC}"
docker compose up -d
echo -e "${GREEN}   ✔ Containers are up${NC}"

# ── Wait for services ─────────────────────────
echo -e "${YELLOW}⏳  Waiting for services to be ready...${NC}"
sleep 3

# ── Show service URLs ─────────────────────────
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  🌐  App     → ${GREEN}http://localhost:8000${NC}"
echo -e "  ⚡  Vite    → ${GREEN}http://localhost:5173${NC}"
echo -e "  🗄️  MySQL   → ${GREEN}localhost:3306${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}🚀  Starting frontend (Vite HMR) + backend dev tools...${NC}"
echo -e "    Press ${RED}Ctrl+C${NC} to stop dev servers (Docker keeps running)."
echo ""

# ── Start dev servers ─────────────────────────
docker compose exec app composer dev
