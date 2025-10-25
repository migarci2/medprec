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
echo "⚠️  NOTA: Para SSL en producción ejecuta: make ssl-init"
echo ""
echo "Ejecuta: make dev  (desarrollo sin SSL)"
echo "      o: make prod (producción con SSL)"
echo ""
