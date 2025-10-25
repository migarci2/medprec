#!/bin/bash
# Script de inicialización para entorno de desarrollo

set -e

echo "🚀 Inicializando entorno de desarrollo MedPrec..."

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p ssl/medprec.com
mkdir -p ssl/app.medprec.com
mkdir -p certbot/www
mkdir -p logs

# Generar certificados autofirmados para desarrollo
echo "🔐 Generando certificados autofirmados para desarrollo..."

if [ ! -f "ssl/medprec.com/fullchain.pem" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/medprec.com/privkey.pem \
        -out ssl/medprec.com/fullchain.pem \
        -subj "/C=ES/ST=Madrid/L=Madrid/O=MedPrec Dev/CN=localhost" \
        2>/dev/null
    echo "  ✅ Certificado generado para medprec.com"
else
    echo "  ℹ️  Certificado ya existe para medprec.com"
fi

if [ ! -f "ssl/app.medprec.com/fullchain.pem" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/app.medprec.com/privkey.pem \
        -out ssl/app.medprec.com/fullchain.pem \
        -subj "/C=ES/ST=Madrid/L=Madrid/O=MedPrec Dev/CN=localhost" \
        2>/dev/null
    echo "  ✅ Certificado generado para app.medprec.com"
else
    echo "  ℹ️  Certificado ya existe para app.medprec.com"
fi

# Verificar que existe package-lock.json en demo
if [ ! -f "demo/package-lock.json" ]; then
    echo "📦 Generando package-lock.json..."
    cd demo
    npm install --package-lock-only
    cd ..
    echo "  ✅ package-lock.json generado"
fi

echo ""
echo "✅ Entorno de desarrollo inicializado"
echo ""
echo "Ejecuta: make dev"
echo ""
