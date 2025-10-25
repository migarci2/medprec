#!/bin/bash
# Script para configurar certificados SSL para producción

set -e

echo "🔐 Configurando SSL para MedPrec..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yaml" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

# Crear directorio para certificados si no existe
mkdir -p ssl/medprec.com
mkdir -p ssl/app.medprec.com
mkdir -p certbot/www

echo ""
echo "📋 Opciones de SSL:"
echo "1) Generar certificados autofirmados (desarrollo/pruebas)"
echo "2) Obtener certificados de Let's Encrypt (producción)"
echo ""
read -p "Selecciona una opción (1 o 2): " option

case $option in
    1)
        echo ""
        echo "📝 Generando certificados autofirmados..."
        
        # Certificado para medprec.com
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/medprec.com/privkey.pem \
            -out ssl/medprec.com/fullchain.pem \
            -subj "/C=ES/ST=Madrid/L=Madrid/O=MedPrec/CN=medprec.com"
        
        # Certificado para app.medprec.com
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/app.medprec.com/privkey.pem \
            -out ssl/app.medprec.com/fullchain.pem \
            -subj "/C=ES/ST=Madrid/L=Madrid/O=MedPrec/CN=app.medprec.com"
        
        echo "✅ Certificados autofirmados generados"
        ;;
    
    2)
        echo ""
        echo "🌐 Configurando Let's Encrypt..."
        read -p "Email para notificaciones: " email
        
        if [ -z "$email" ]; then
            echo "❌ Email es requerido"
            exit 1
        fi
        
        echo ""
        echo "⚠️  Asegúrate de que los dominios apunten a este servidor"
        echo "   medprec.com -> $(curl -s ifconfig.me)"
        echo "   app.medprec.com -> $(curl -s ifconfig.me)"
        echo ""
        read -p "¿Los DNS están configurados correctamente? (s/n): " dns_ready
        
        if [ "$dns_ready" != "s" ]; then
            echo "❌ Configura los DNS primero"
            exit 1
        fi
        
        # Iniciar nginx temporalmente con configuración HTTP
        echo "🚀 Iniciando servidor temporal..."
        cp nginx-http-only.conf nginx.conf.backup
        docker compose up -d nginx
        sleep 5
        
        # Obtener certificados
        echo "📜 Solicitando certificado para medprec.com..."
        docker compose run --rm certbot certonly --webroot \
            --webroot-path=/var/www/certbot \
            --email $email \
            --agree-tos \
            --no-eff-email \
            -d medprec.com -d www.medprec.com
        
        echo "📜 Solicitando certificado para app.medprec.com..."
        docker compose run --rm certbot certonly --webroot \
            --webroot-path=/var/www/certbot \
            --email $email \
            --agree-tos \
            --no-eff-email \
            -d app.medprec.com
        
        # Copiar certificados al directorio ssl
        cp -rL /etc/letsencrypt/live/medprec.com/* ssl/medprec.com/ || true
        cp -rL /etc/letsencrypt/live/app.medprec.com/* ssl/app.medprec.com/ || true
        
        echo "✅ Certificados de Let's Encrypt obtenidos"
        ;;
    
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "✅ SSL configurado correctamente"
echo ""
echo "Siguientes pasos:"
echo "1. Restaurar nginx.conf con configuración SSL"
echo "2. Reiniciar servicios: make restart"
echo ""
