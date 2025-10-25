# MedPrec - Deployment

Configuración completa de despliegue para **MedPrec** con Docker, Nginx y SSL.

## 🏗️ Arquitectura

```
                    Internet
                       |
                   Nginx (80/443)
                       |
        +--------------+---------------+
        |                              |
   Landing Page                   Demo App
   (medprec.com)              (app.medprec.com)
   nginx:alpine                React + nginx:alpine
```

## 📦 Estructura del Proyecto

```
medprec/
├── demo/                    # Aplicación React Demo
│   ├── src/
│   ├── Dockerfile
│   ├── nginx-demo.conf
│   └── package.json
├── landing/                 # Landing Page estática
│   ├── index.html
│   ├── Dockerfile
│   └── nginx-landing.conf
├── docker-compose.yaml      # Producción
├── docker-compose.dev.yaml  # Desarrollo
├── nginx.conf              # Nginx principal (producción)
├── nginx.dev.conf          # Nginx desarrollo
├── Makefile                # Comandos útiles
└── README.md
```

## 🚀 Quick Start

### Desarrollo Local

```bash
# Iniciar en modo desarrollo (sin SSL)
make dev

# O con docker-compose directamente
docker-compose -f docker-compose.dev.yaml up --build
```

**URLs de desarrollo:**
- Landing: http://localhost o http://medprec.local
- Demo: http://app.localhost o http://app.medprec.local

### Producción

```bash
# 1. Configurar SSL (primera vez)
make ssl-init

# 2. Iniciar servicios
make prod

# 3. Ver logs
make logs
```

**URLs de producción:**
- Landing: https://medprec.com
- Demo: https://app.medprec.com

## 🔧 Comandos Disponibles

```bash
make help           # Ver todos los comandos disponibles
make dev            # Desarrollo
make prod           # Producción
make logs           # Ver logs
make ssl-init       # Configurar SSL
make ssl-renew      # Renovar certificados
make clean          # Limpiar
make status         # Ver estado
```

## 🔐 Configuración SSL

### Primera vez (Let's Encrypt)

1. **Editar Makefile** - Cambiar el email en `ssl-init`:
```makefile
--email hello@medprec.com \
```

2. **Asegurar que los dominios apuntan a tu servidor:**
```bash
# Verificar DNS
dig medprec.com
dig app.medprec.com
```

3. **Obtener certificados:**
```bash
make ssl-init
```

4. **Iniciar con SSL:**
```bash
make prod
```

### Renovación automática

Certbot renueva automáticamente los certificados cada 12 horas. También puedes forzar la renovación:

```bash
make ssl-renew
```

## 🐳 Docker

### Servicios

- **landing**: Landing page estática (Nginx)
- **demo**: Aplicación React build + Nginx
- **nginx**: Reverse proxy principal
- **certbot**: Gestión de certificados SSL

### Comandos útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs -f nginx
docker-compose logs -f demo
docker-compose logs -f landing

# Reiniciar un servicio
docker-compose restart nginx

# Acceder al shell de un contenedor
docker-compose exec nginx sh
docker-compose exec demo sh

# Testear configuración de Nginx
docker-compose exec nginx nginx -t

# Recargar Nginx sin downtime
docker-compose exec nginx nginx -s reload
```

## 🌐 Configuración de DNS

Para producción, configura los siguientes registros DNS:

```
A     medprec.com         → IP_DE_TU_SERVIDOR
A     www.medprec.com     → IP_DE_TU_SERVIDOR
A     app.medprec.com     → IP_DE_TU_SERVIDOR
```

Para desarrollo local, añade a `/etc/hosts`:

```
127.0.0.1   medprec.local
127.0.0.1   app.medprec.local
```

## 📊 Monitoreo y Logs

### Ver logs en tiempo real

```bash
# Todos los servicios
make logs

# Solo Nginx
make logs-nginx

# Solo Demo
make logs-demo

# Solo Landing
make logs-landing
```

### Ubicación de logs

Los logs de Nginx se almacenan en un volumen Docker:
- Access log: `/var/log/nginx/access.log`
- Error log: `/var/log/nginx/error.log`

## 🔄 Actualización y Deploy

### Actualizar la aplicación

```bash
# 1. Pull cambios
git pull origin main

# 2. Rebuild y reiniciar
make prod

# 3. Verificar
make status
```

### Rollback rápido

```bash
# Volver a la versión anterior
git checkout <commit-hash>
make prod
```

## 🛡️ Security Headers

Nginx está configurado con headers de seguridad:

- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Referrer-Policy`

## ⚡ Performance

### Optimizaciones incluidas:

- ✅ Gzip compression
- ✅ HTTP/2
- ✅ Static asset caching (1 año)
- ✅ Keepalive connections
- ✅ Rate limiting
- ✅ Health checks

## 🧪 Testing

### Testear configuración de Nginx

```bash
make test-nginx
```

### Probar SSL

```bash
# Verificar certificados
openssl s_client -connect medprec.com:443 -servername medprec.com

# Test SSL Labs
# https://www.ssllabs.com/ssltest/analyze.html?d=medprec.com
```

## 📝 Variables de Entorno

Puedes crear archivos `.env` para configuraciones específicas:

```bash
# .env
COMPOSE_PROJECT_NAME=medprec
NGINX_PORT=80
NGINX_SSL_PORT=443
```

## 🆘 Troubleshooting

### Contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs <servicio>

# Ver configuración
docker-compose config
```

### Error de SSL

```bash
# Verificar certificados
ls -la ./ssl/live/medprec.com/

# Renovar manualmente
make ssl-renew
```

### Puerto 80/443 ocupado

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :80
sudo lsof -i :443

# Detener servicio conflictivo
sudo systemctl stop apache2  # o nginx, etc.
```

## 📚 Recursos

- [Nginx Docs](https://nginx.org/en/docs/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Let's Encrypt Docs](https://letsencrypt.org/docs/)
- [React Docs](https://react.dev/)

## 📄 Licencia

Propiedad de MedPrec. Todos los derechos reservados.

---

**MedPrec** - Tu salud, visualizada 🏥
