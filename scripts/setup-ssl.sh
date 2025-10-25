#!/bin/bash
# Script para obtener certificados SSL de Let's Encrypt

set -e

echo "🔐 Configuración de SSL con Let's Encrypt"
echo "=========================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yaml" ]; then
    echo -e "${RED}❌ Error: Ejecutar desde el directorio raíz del proyecto${NC}"
    exit 1
fi

# Verificar que los dominios están configurados
echo -e "${YELLOW}⚠️  IMPORTANTE: Antes de continuar, asegúrate de que:${NC}"
echo "  1. Los dominios apuntan a este servidor (DNS configurado)"
echo "  2. Los puertos 80 y 443 están abiertos"
echo ""
read -p "¿Has configurado los DNS correctamente? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo -e "${RED}❌ Por favor configura los DNS primero.${NC}"
    exit 1
fi

# Solicitar email
echo ""
read -p "📧 Ingresa tu email para Let's Encrypt: " EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ El email es requerido.${NC}"
    exit 1
fi

# Crear directorios necesarios
echo ""
echo "� Creando directorios..."
mkdir -p ssl certbot/www

# Detener servicios si están corriendo
echo ""
echo "🛑 Deteniendo servicios..."
docker compose down 2>/dev/null || true

# Iniciar solo los servicios necesarios
echo ""
echo "🚀 Iniciando servicios para validación HTTP..."
docker compose up -d landing demo

# Esperar a que los servicios estén listos
echo "⏳ Esperando servicios..."
sleep 5

# Obtener certificados
echo ""
echo "📜 Solicitando certificados de Let's Encrypt..."
echo ""

# Certificado para medprec.com y www.medprec.com
echo "   → Obteniendo certificado para medprec.com..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d medprec.com \
    -d www.medprec.com

# Certificado para app.medprec.com
echo ""
echo "   → Obteniendo certificado para app.medprec.com..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d app.medprec.com

# Verificar que los certificados se crearon
if [ -f "ssl/live/medprec.com/fullchain.pem" ] && [ -f "ssl/live/app.medprec.com/fullchain.pem" ]; then
    echo ""
    echo -e "${GREEN}✅ Certificados obtenidos exitosamente!${NC}"
    echo ""
    
    # Crear estructura compatible con nginx.conf
    echo "📂 Organizando certificados..."
    mkdir -p ssl/medprec.com ssl/app.medprec.com
    
    # Crear enlaces simbólicos
    ln -sf ../live/medprec.com/fullchain.pem ssl/medprec.com/fullchain.pem
    ln -sf ../live/medprec.com/privkey.pem ssl/medprec.com/privkey.pem
    ln -sf ../live/app.medprec.com/fullchain.pem ssl/app.medprec.com/fullchain.pem
    ln -sf ../live/app.medprec.com/privkey.pem ssl/app.medprec.com/privkey.pem
    
    echo ""
    echo -e "${GREEN}✅ ¡Configuración completada!${NC}"
    echo ""
    echo "Ahora puedes iniciar los servicios en producción con:"
    echo -e "${GREEN}make prod${NC}"
    
    # Detener servicios temporales
    docker compose down
else
    echo ""
    echo -e "${RED}❌ Error al obtener certificados.${NC}"
    echo "Verifica que:"
    echo "  1. Los dominios apuntan correctamente a este servidor"
    echo "  2. Los puertos 80 y 443 están accesibles"
    echo "  3. No hay firewall bloqueando las conexiones"
    docker compose down
    exit 1
fi
