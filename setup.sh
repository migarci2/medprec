#!/bin/bash

# Script de inicialización para MedPrec
# Prepara el entorno para desarrollo o producción

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔══════════════════════════════════════╗"
echo "║     MedPrec - Setup Script          ║"
echo "║     Tu salud, visualizada           ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado${NC}"
    echo "Instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    echo "Instala Docker Compose desde: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker y Docker Compose encontrados${NC}"

# Crear directorios necesarios
echo -e "${YELLOW}Creando directorios necesarios...${NC}"
mkdir -p ssl certbot/www

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creando archivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠ Edita el archivo .env con tu configuración antes de continuar${NC}"
fi

# Preguntar modo de instalación
echo ""
echo -e "${YELLOW}Selecciona el modo de instalación:${NC}"
echo "1) Desarrollo (sin SSL, localhost)"
echo "2) Producción (con SSL, dominios reales)"
read -p "Opción [1/2]: " mode

if [ "$mode" = "1" ]; then
    echo -e "${GREEN}Iniciando en modo DESARROLLO...${NC}"
    echo ""
    echo "URLs disponibles:"
    echo "  - Landing: http://localhost"
    echo "  - Demo: http://app.localhost"
    echo ""
    echo "Para usar dominios locales, añade a /etc/hosts:"
    echo "  127.0.0.1   medprec.local"
    echo "  127.0.0.1   app.medprec.local"
    echo ""
    read -p "¿Continuar? [Y/n]: " confirm
    
    if [ "$confirm" != "n" ] && [ "$confirm" != "N" ]; then
        docker-compose -f docker-compose.dev.yaml up --build
    fi
    
elif [ "$mode" = "2" ]; then
    echo -e "${GREEN}Configurando modo PRODUCCIÓN...${NC}"
    echo ""
    
    # Verificar configuración DNS
    echo -e "${YELLOW}Verificando configuración DNS...${NC}"
    read -p "Dominio principal (ej: medprec.com): " domain_main
    read -p "Dominio demo (ej: app.medprec.com): " domain_demo
    read -p "Email para Let's Encrypt: " ssl_email
    
    # Actualizar .env
    sed -i "s|DOMAIN_LANDING=.*|DOMAIN_LANDING=$domain_main|" .env
    sed -i "s|DOMAIN_DEMO=.*|DOMAIN_DEMO=$domain_demo|" .env
    sed -i "s|SSL_EMAIL=.*|SSL_EMAIL=$ssl_email|" .env
    
    echo ""
    echo -e "${YELLOW}Asegúrate de que los siguientes registros DNS apuntan a este servidor:${NC}"
    echo "  A    $domain_main          → $(curl -s ifconfig.me)"
    echo "  A    www.$domain_main      → $(curl -s ifconfig.me)"
    echo "  A    $domain_demo          → $(curl -s ifconfig.me)"
    echo ""
    read -p "¿DNS configurado correctamente? [y/N]: " dns_ok
    
    if [ "$dns_ok" = "y" ] || [ "$dns_ok" = "Y" ]; then
        echo ""
        echo -e "${GREEN}Iniciando servicios...${NC}"
        
        # Build inicial
        docker-compose build
        
        # Iniciar sin SSL primero para obtener certificados
        echo -e "${YELLOW}Obteniendo certificados SSL...${NC}"
        docker-compose up -d
        
        # Obtener certificados
        docker-compose run --rm certbot certonly --webroot \
            --webroot-path=/var/www/certbot \
            --email "$ssl_email" \
            --agree-tos \
            --no-eff-email \
            -d "$domain_main" \
            -d "www.$domain_main" \
            -d "$domain_demo"
        
        # Reiniciar con SSL
        echo -e "${GREEN}Reiniciando con SSL...${NC}"
        docker-compose restart nginx
        
        echo ""
        echo -e "${GREEN}✓ Instalación completa!${NC}"
        echo ""
        echo "URLs disponibles:"
        echo "  - Landing: https://$domain_main"
        echo "  - Demo: https://$domain_demo"
        echo ""
        echo "Comandos útiles:"
        echo "  make logs       # Ver logs"
        echo "  make status     # Ver estado"
        echo "  make ssl-renew  # Renovar SSL"
    else
        echo -e "${RED}Configura el DNS primero y vuelve a ejecutar este script${NC}"
        exit 1
    fi
else
    echo -e "${RED}Opción inválida${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Setup completado!${NC}"
