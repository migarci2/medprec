# MedPrec - Guía Rápida de Despliegue

## 🎯 Inicio Rápido

### 1. Desarrollo Local (Recomendado para empezar)

```bash
# Opción 1: Usando el script automático
./setup.sh
# Selecciona opción "1" para desarrollo

# Opción 2: Manual
make dev
```

**Accede a:**
- Landing: http://localhost
- Demo: http://app.localhost

### 2. Producción

```bash
# Configuración inicial (solo primera vez)
./setup.sh
# Selecciona opción "2" para producción

# O manual:
make ssl-init    # Obtener certificados SSL
make prod        # Iniciar servicios
```

**Accede a:**
- Landing: https://medprec.com
- Demo: https://app.medprec.com

---

## 📋 Comandos Principales

```bash
# DESARROLLO
make dev            # Iniciar desarrollo
make dev-d          # Iniciar desarrollo en background
make dev-down       # Detener desarrollo

# PRODUCCIÓN
make prod           # Iniciar producción
make build          # Build imágenes
make up             # Iniciar servicios
make down           # Detener servicios
make restart        # Reiniciar servicios

# LOGS
make logs           # Todos los logs
make logs-nginx     # Solo Nginx
make logs-demo      # Solo Demo
make logs-landing   # Solo Landing

# SSL
make ssl-init       # Primera vez
make ssl-renew      # Renovar

# MANTENIMIENTO
make status         # Ver estado
make health         # Health checks
make clean          # Limpiar
make test-nginx     # Test config Nginx

# SCRIPTS
./setup.sh          # Setup interactivo
./deploy.sh         # Deploy nueva versión
./backup.sh         # Backup configuración
./health-check.sh   # Verificar salud del sistema
```

---

## 🔧 Configuración DNS (Producción)

Antes de desplegar en producción, configura estos registros DNS:

```
Tipo    Nombre              Valor
A       medprec.com         → TU_IP_SERVIDOR
A       www.medprec.com     → TU_IP_SERVIDOR
A       app.medprec.com     → TU_IP_SERVIDOR
```

Verificar:
```bash
dig medprec.com +short
dig app.medprec.com +short
```

---

## 🐳 Estructura de Contenedores

```
┌─────────────────────────────────────────┐
│           Nginx Reverse Proxy           │
│         (80/443 → dominios)             │
└──────────┬──────────────────────┬───────┘
           │                      │
    ┌──────▼──────┐        ┌──────▼──────┐
    │   Landing   │        │    Demo     │
    │   (Nginx)   │        │ (React+Nginx)│
    └─────────────┘        └─────────────┘
```

---

## 📝 Archivos de Configuración

```
medprec/
├── docker-compose.yaml        # Producción
├── docker-compose.dev.yaml    # Desarrollo
├── nginx.conf                 # Nginx producción
├── nginx.dev.conf            # Nginx desarrollo
├── .env                      # Variables (crear desde .env.example)
│
├── demo/
│   ├── Dockerfile            # Build React app
│   └── nginx-demo.conf       # Config Nginx para demo
│
└── landing/
    ├── Dockerfile            # Build landing
    └── nginx-landing.conf    # Config Nginx para landing
```

---

## 🔐 SSL con Let's Encrypt

### Primera configuración

```bash
# Método 1: Automático
./setup.sh
# Selecciona opción 2 y sigue las instrucciones

# Método 2: Manual
make ssl-init
```

### Renovación

Los certificados se renuevan automáticamente cada 12 horas.

Para forzar renovación:
```bash
make ssl-renew
```

---

## 🚨 Troubleshooting

### Puerto 80/443 ocupado

```bash
# Ver qué usa el puerto
sudo lsof -i :80
sudo lsof -i :443

# Detener servicio conflictivo
sudo systemctl stop nginx
sudo systemctl stop apache2
```

### Contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs <servicio>

# Ver estado
make status

# Verificar configuración
docker-compose config
```

### SSL no funciona

```bash
# Verificar certificados
ls -la ssl/live/medprec.com/

# Ver logs de certbot
docker-compose logs certbot

# Verificar DNS
dig medprec.com
```

### Actualizar después de cambios

```bash
# Rebuild completo
make down
make prod

# O usar script de deploy
./deploy.sh
```

---

## 📊 Monitoreo

### Ver estado del sistema

```bash
./health-check.sh
```

### Ver logs en tiempo real

```bash
# Todos
make logs

# Específico
docker-compose logs -f nginx
```

### Verificar recursos

```bash
# Uso de recursos
docker stats

# Estado de contenedores
make status
```

---

## 🔄 Workflow de Actualización

```bash
# 1. Backup (opcional pero recomendado)
./backup.sh

# 2. Pull cambios
git pull origin main

# 3. Deploy
./deploy.sh

# 4. Verificar
make status
make logs
./health-check.sh
```

---

## 🧪 Testing Local

### Test desarrollo

```bash
# Iniciar
make dev

# Verificar
curl http://localhost              # Landing
curl http://app.localhost          # Demo
```

### Test producción (local)

```bash
# Añadir a /etc/hosts
127.0.0.1   medprec.com
127.0.0.1   app.medprec.com

# Iniciar sin SSL para test
docker-compose up

# Verificar
curl http://medprec.com
curl http://app.medprec.com
```

---

## 💡 Tips

1. **Siempre usa `make help`** para ver comandos disponibles

2. **Para desarrollo**, usa `make dev` (más rápido, sin SSL)

3. **Para producción**, asegúrate de:
   - DNS configurado ✓
   - Puerto 80/443 libre ✓
   - Email válido para SSL ✓

4. **Backups regulares**:
   ```bash
   ./backup.sh
   ```

5. **Monitoring**:
   ```bash
   # Cron job para health check
   */5 * * * * /ruta/a/medprec/health-check.sh >> /var/log/medprec-health.log
   ```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa logs: `make logs`
2. Verifica estado: `make status`
3. Ejecuta health check: `./health-check.sh`
4. Consulta README.md completo
5. Revisa troubleshooting arriba

---

**MedPrec** - Tu salud, visualizada 🏥
