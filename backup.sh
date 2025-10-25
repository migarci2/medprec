#!/bin/bash

# Script de backup de la configuración y datos

set -e

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}MedPrec - Backup Script${NC}"
echo ""

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"

# Backup de configuración
echo -e "${YELLOW}Backing up configuración...${NC}"
cp nginx.conf "$BACKUP_DIR/"
cp docker-compose.yaml "$BACKUP_DIR/"
cp .env "$BACKUP_DIR/" 2>/dev/null || echo "No .env file found"

# Backup de certificados SSL
if [ -d "ssl" ]; then
    echo -e "${YELLOW}Backing up certificados SSL...${NC}"
    cp -r ssl "$BACKUP_DIR/"
fi

# Crear archivo de información
cat > "$BACKUP_DIR/info.txt" << EOF
MedPrec Backup
Created: $(date)
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git rev-parse --abbrev-ref HEAD)
EOF

echo ""
echo -e "${GREEN}✓ Backup completado en: $BACKUP_DIR${NC}"
