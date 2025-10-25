#!/bin/bash

# Script para actualizar y desplegar nueva versión

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}MedPrec - Deploy Script${NC}"
echo ""

# Verificar rama actual
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${YELLOW}Rama actual: $BRANCH${NC}"

# Pull cambios
echo -e "${YELLOW}Actualizando código...${NC}"
git pull origin "$BRANCH"

# Rebuild y restart
echo -e "${YELLOW}Rebuilding servicios...${NC}"
docker-compose build --no-cache

echo -e "${YELLOW}Reiniciando servicios...${NC}"
docker-compose up -d

# Esperar a que estén healthy
echo -e "${YELLOW}Esperando a que los servicios estén listos...${NC}"
sleep 10

# Verificar estado
echo ""
echo -e "${GREEN}Estado de los servicios:${NC}"
docker-compose ps

# Cleanup
echo ""
echo -e "${YELLOW}Limpiando imágenes antiguas...${NC}"
docker image prune -f

echo ""
echo -e "${GREEN}✓ Deploy completado!${NC}"
echo ""
echo "Verificar:"
echo "  make logs       # Ver logs"
echo "  make status     # Ver estado"
