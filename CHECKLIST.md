# 🚀 MedPrec - Checklist de Despliegue

## Pre-Deployment Checklist

### ✅ Configuración Inicial

- [ ] Docker y Docker Compose instalados
- [ ] Git configurado
- [ ] Servidor con al menos 2GB RAM
- [ ] Puertos 80, 443, 22 disponibles

### ✅ DNS y Dominios

- [ ] Dominio `medprec.com` comprado/configurado
- [ ] Subdomain `app.medprec.com` configurado
- [ ] Registro A apuntando a IP del servidor
  ```bash
  # Verificar con:
  dig medprec.com +short
  dig app.medprec.com +short
  ```
- [ ] DNS propagado (puede tardar hasta 48h)

### ✅ Configuración del Proyecto

- [ ] Archivo `.env` creado desde `.env.example`
  ```bash
  cp .env.example .env
  ```
- [ ] Email válido configurado en `.env` para SSL
- [ ] Dominios correctos en `.env`

### ✅ Firewall y Seguridad

- [ ] UFW o iptables configurado
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```
- [ ] SSH keys configuradas (no usar password)
- [ ] Fail2ban instalado (opcional pero recomendado)

### ✅ Preparación del Código

- [ ] Build de React funciona localmente
  ```bash
  cd demo
  npm install
  npm run build
  ```
- [ ] Landing page HTML válido
- [ ] Todas las dependencias instaladas

### ✅ Testing Local

- [ ] Tests de desarrollo pasando
  ```bash
  make dev
  # Verificar http://localhost
  # Verificar http://app.localhost
  ```
- [ ] Build de Docker exitoso
  ```bash
  docker-compose build
  ```
- [ ] Nginx config válido
  ```bash
  make test-nginx
  ```

---

## Deployment Steps

### 1. Desarrollo Local (Testing)

```bash
# Clonar repo
git clone <repo-url>
cd medprec

# Setup inicial
./setup.sh
# Seleccionar opción 1 (desarrollo)

# Verificar
curl http://localhost
curl http://app.localhost
```

**Checklist:**
- [ ] Landing carga correctamente
- [ ] Demo carga correctamente
- [ ] No hay errores en consola
- [ ] Todos los componentes React funcionan

### 2. Preparar Servidor

```bash
# En el servidor
ssh user@tu-servidor

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar
docker --version
docker-compose --version
```

**Checklist:**
- [ ] Docker instalado
- [ ] Docker Compose instalado
- [ ] Usuario en grupo docker
  ```bash
  sudo usermod -aG docker $USER
  ```

### 3. Deploy Inicial

```bash
# En el servidor
git clone <repo-url>
cd medprec

# Configurar .env
cp .env.example .env
nano .env
# Editar con tus valores

# Setup automático
./setup.sh
# Seleccionar opción 2 (producción)
```

**Checklist:**
- [ ] .env configurado correctamente
- [ ] DNS verificado
- [ ] SSL certificates obtenidos
- [ ] Todos los contenedores running
  ```bash
  make status
  ```

### 4. Verificación Post-Deploy

```bash
# Health check
./health-check.sh

# Logs
make logs

# Test URLs
curl -I https://medprec.com
curl -I https://app.medprec.com
```

**Checklist:**
- [ ] HTTPS funciona en ambos dominios
- [ ] Redirect HTTP → HTTPS funciona
- [ ] Certificados SSL válidos
- [ ] Landing page carga
- [ ] Demo app carga y funciona
- [ ] No hay errores en logs

---

## Post-Deployment

### ✅ Monitoreo

- [ ] Configurar cron job para health checks
  ```bash
  crontab -e
  # Añadir:
  */30 * * * * /path/to/medprec/health-check.sh >> /var/log/medprec-health.log 2>&1
  ```
- [ ] Configurar alertas (opcional)
- [ ] Configurar backup automático
  ```bash
  # Backup diario a las 3 AM
  0 3 * * * /path/to/medprec/backup.sh
  ```

### ✅ Optimización

- [ ] Configurar CDN (Cloudflare) (opcional)
- [ ] Optimizar imágenes y assets
- [ ] Configurar caché adicional si necesario
- [ ] Revisar métricas de performance

### ✅ Documentación

- [ ] Documentar credenciales de forma segura
- [ ] Documentar proceso de actualización
- [ ] Compartir accesos con equipo
- [ ] Documentar configuraciones custom

---

## Mantenimiento Regular

### Semanal
- [ ] Revisar logs
  ```bash
  make logs | grep -i error
  ```
- [ ] Verificar uso de disco
  ```bash
  df -h
  docker system df
  ```

### Mensual
- [ ] Actualizar paquetes del sistema
  ```bash
  sudo apt update && sudo apt upgrade
  ```
- [ ] Limpiar imágenes Docker antiguas
  ```bash
  make clean
  ```
- [ ] Verificar certificados SSL
  ```bash
  make ssl-renew
  ```
- [ ] Backup completo
  ```bash
  ./backup.sh
  ```

### Trimestral
- [ ] Revisar seguridad
- [ ] Actualizar dependencias
  ```bash
  cd demo
  npm audit fix
  ```
- [ ] Review de performance
- [ ] Test de disaster recovery

---

## Troubleshooting Común

### SSL no funciona
```bash
# Verificar
openssl s_client -connect medprec.com:443 -servername medprec.com

# Renovar
make ssl-renew

# Logs de certbot
docker-compose logs certbot
```

### Contenedor no inicia
```bash
# Ver logs
docker-compose logs <servicio>

# Rebuild
docker-compose build --no-cache <servicio>
docker-compose up -d
```

### Cambios no se reflejan
```bash
# Rebuild completo
make down
make prod

# O forzar recreación
docker-compose up -d --force-recreate
```

### Out of disk space
```bash
# Limpiar Docker
docker system prune -a --volumes

# Limpiar logs antiguos
sudo journalctl --vacuum-time=7d
```

---

## Rollback Procedure

En caso de problemas después de un deploy:

```bash
# 1. Ver commits
git log --oneline -10

# 2. Volver a versión anterior
git checkout <commit-hash-anterior>

# 3. Rebuild y deploy
./deploy.sh

# 4. Verificar
./health-check.sh
```

---

## Comandos de Emergencia

```bash
# DETENER TODO
make down

# RESTART COMPLETO
make down
make clean
make prod

# VER ESTADO
make status
make logs

# LOGS EN TIEMPO REAL
make logs | tail -f

# ACCEDER A CONTAINER
docker-compose exec nginx sh
docker-compose exec demo sh

# RELOAD NGINX SIN DOWNTIME
docker-compose exec nginx nginx -s reload
```

---

## Contactos de Emergencia

```
Servidor: _______________________
Proveedor DNS: __________________
Proveedor Hosting: ______________
Email SSL: ______________________
GitHub: _________________________
```

---

## Firma de Aprobación

- [ ] Revisado por: _________________ Fecha: _______
- [ ] Aprobado por: _________________ Fecha: _______
- [ ] Desplegado por: _______________ Fecha: _______

---

**MedPrec** - Ready for Production! 🚀
