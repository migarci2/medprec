#!/bin/bash
# Script para obtener certificados SSL de Let's Encrypt

set -e

echo "🔐 Configurando SSL con Let's Encrypt para MedPrec..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yaml" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

# Crear directorios necesarios
mkdir -p ssl/medprec.com
mkdir -p ssl/app.medprec.com
mkdir -p certbot/www

# Solicitar email
read -p "📧 Email para notificaciones de Let's Encrypt: " email

if [ -z "$email" ]; then
    echo "❌ Email es requerido"
    exit 1
fi

# Verificar IP pública
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "No disponible")

echo ""
echo "⚠️  IMPORTANTE: Verifica que tus DNS estén configurados:"
echo ""
echo "   Dominio              Tipo    Apunta a"
echo "   ─────────────────    ────    ─────────────"
echo "   medprec.com          A       $PUBLIC_IP"
echo "   www.medprec.com      A       $PUBLIC_IP"
echo "   app.medprec.com      A       $PUBLIC_IP"
echo ""
read -p "¿Los DNS están configurados correctamente? (s/n): " dns_ready

if [ "$dns_ready" != "s" ] && [ "$dns_ready" != "S" ]; then
    echo ""
    echo "❌ Por favor configura tus DNS primero y vuelve a ejecutar:"
    echo "   make ssl-init"
    exit 1
fi

echo ""
echo "🚀 Iniciando servicios para validación..."

# Usar configuración HTTP temporal para validación
if [ -f "nginx-http-only.conf" ]; then
    # Backup de la configuración actual
    cp nginx.conf nginx.conf.bak
    cp nginx-http-only.conf nginx.conf
    echo "   → Usando configuración HTTP temporal"
fi

# Iniciar servicios
docker compose up -d landing demo nginx
sleep 8

echo ""
echo "📜 Solicitando certificados de Let's Encrypt..."
echo ""

# Obtener certificado para medprec.com y www.medprec.com
echo "   → Obteniendo certificado para medprec.com..."
docker compose run --rm certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email "$email" \
    --agree-tos \
    --no-eff-email \
    -d medprec.com \
    -d www.medprec.com

# Obtener certificado para app.medprec.com
echo ""
echo "   → Obteniendo certificado para app.medprec.com..."
docker compose run --rm certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email "$email" \
    --agree-tos \
    --no-eff-email \
    -d app.medprec.com

echo ""
echo "📋 Creando enlaces simbólicos a los certificados..."

# Crear enlaces simbólicos desde /etc/letsencrypt a ./ssl
docker compose exec -T nginx sh -c "
    ln -sf /etc/letsencrypt/live/medprec.com/fullchain.pem /etc/nginx/ssl/medprec.com/fullchain.pem
    ln -sf /etc/letsencrypt/live/medprec.com/privkey.pem /etc/nginx/ssl/medprec.com/privkey.pem
    ln -sf /etc/letsencrypt/live/app.medprec.com/fullchain.pem /etc/nginx/ssl/app.medprec.com/fullchain.pem
    ln -sf /etc/letsencrypt/live/app.medprec.com/privkey.pem /etc/nginx/ssl/app.medprec.com/privkey.pem
" 2>/dev/null || echo "   ℹ️  Enlaces se crearán al reiniciar"

# Restaurar configuración SSL si existe backup
if [ -f "nginx.conf.bak" ]; then
    mv nginx.conf.bak nginx.conf
    echo "   → Configuración SSL restaurada"
fi

echo ""
echo "✅ ¡Certificados SSL obtenidos exitosamente!"
echo ""
echo "📋 Siguientes pasos:"
echo "   1. Reiniciar servicios: docker compose restart"
echo "   2. Verificar: https://medprec.com"
echo "   3. Verificar: https://app.medprec.com"
echo ""
echo "🔄 Los certificados se renovarán automáticamente cada 12 horas"
echo ""
