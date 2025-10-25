# MedPrec - Arquitectura de Despliegue

## 📐 Diagrama de Arquitectura

```
                          INTERNET
                             │
                             │
                    ┌────────▼────────┐
                    │   DNS Server    │
                    │  medprec.com    │
                    │app.medprec.com  │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────▼──────┐         ┌───────▼──────┐
         │ medprec.com │         │app.medprec.com│
         └──────┬──────┘         └───────┬───────┘
                │                        │
                └────────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │  Servidor VPS   │
                    │  Ports 80/443   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │     Docker Network          │
              │   (medprec-network)         │
              │                             │
              │  ┌───────────────────┐     │
              │  │  Nginx Proxy      │     │
              │  │  (nginx:alpine)   │     │
              │  │                   │     │
              │  │  • SSL/TLS        │     │
              │  │  • Rate Limiting  │     │
              │  │  • Gzip           │     │
              │  │  • Security       │     │
              │  └─────┬─────────┬───┘     │
              │        │         │         │
              │   ┌────▼─────┐  ┌▼──────┐ │
              │   │ Landing  │  │ Demo  │ │
              │   │ (Nginx)  │  │(React)│ │
              │   │          │  │       │ │
              │   │Static    │  │Built  │ │
              │   │HTML/CSS  │  │SPA    │ │
              │   └──────────┘  └───────┘ │
              │                            │
              │  ┌───────────────────┐    │
              │  │   Certbot         │    │
              │  │   (Let's Encrypt) │    │
              │  └───────────────────┘    │
              └────────────────────────────┘
```

## 🔄 Flujo de Tráfico

### Landing Page (medprec.com)

```
Usuario → DNS → Nginx (443) → Landing Container (80) → HTML/CSS estático
```

1. Usuario accede a `https://medprec.com`
2. DNS resuelve a la IP del servidor
3. Nginx recibe la petición en puerto 443 (HTTPS)
4. Nginx hace proxy a `landing:80`
5. Container de Landing sirve archivos estáticos
6. Respuesta vuelve al usuario

### Demo App (app.medprec.com)

```
Usuario → DNS → Nginx (443) → Demo Container (80) → React SPA
```

1. Usuario accede a `https://app.medprec.com`
2. DNS resuelve a la IP del servidor
3. Nginx recibe la petición en puerto 443 (HTTPS)
4. Nginx hace proxy a `demo:80`
5. Container de Demo sirve React build
6. React Router maneja navegación client-side
7. Respuesta vuelve al usuario

## 🐳 Containers Overview

### 1. Nginx Proxy (nginx)
```yaml
Imagen: nginx:alpine
Puertos: 80, 443
Función: Reverse proxy, SSL termination, routing
```

**Responsabilidades:**
- SSL/TLS termination
- HTTP → HTTPS redirect
- Domain-based routing
- Rate limiting
- Security headers
- Gzip compression

### 2. Landing Container (landing)
```yaml
Imagen: nginx:alpine
Puerto interno: 80
Función: Servir landing page estática
```

**Contenido:**
- index.html + CSS inline
- Assets estáticos
- SEO optimizado

### 3. Demo Container (demo)
```yaml
Imagen: Multi-stage (node:18 → nginx:alpine)
Puerto interno: 80
Función: React SPA
```

**Build process:**
1. Stage 1 (Builder): `npm install` + `npm run build`
2. Stage 2 (Runner): Copiar build a nginx
3. Nginx sirve SPA con fallback a index.html

### 4. Certbot (certbot)
```yaml
Imagen: certbot/certbot
Función: Gestión automática de certificados SSL
```

**Proceso:**
- Obtención inicial de certificados
- Renovación automática cada 12h
- Validación ACME vía webroot

## 📊 Networking

```
┌─────────────────────────────────────────┐
│      medprec-network (Bridge)           │
│                                          │
│  nginx          → 172.18.0.2            │
│  landing        → 172.18.0.3            │
│  demo           → 172.18.0.4            │
│  certbot        → 172.18.0.5            │
│                                          │
└─────────────────────────────────────────┘

Comunicación interna:
- nginx → landing:80
- nginx → demo:80
- certbot → nginx (volúmenes compartidos)
```

## 💾 Volumes y Storage

```
Volumes:
┌──────────────────────────────────────────┐
│ nginx-logs    (Docker volume)            │
│ └─ /var/log/nginx/                       │
└──────────────────────────────────────────┘

Bind Mounts:
┌──────────────────────────────────────────┐
│ ./nginx.conf → /etc/nginx/nginx.conf    │
│ ./ssl → /etc/nginx/ssl                   │
│ ./certbot/www → /var/www/certbot        │
└──────────────────────────────────────────┘
```

## 🔐 SSL/TLS Flow

```
┌─────────────────────────────────────────────────┐
│  1. Cliente solicita https://medprec.com       │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  2. Nginx presenta certificado SSL             │
│     /etc/nginx/ssl/medprec.com/fullchain.pem   │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  3. TLS Handshake (TLSv1.2/1.3)                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  4. Conexión cifrada establecida               │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  5. Nginx proxy a backend (HTTP interno)       │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  6. Backend responde                            │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  7. Nginx encripta y envía al cliente          │
└─────────────────────────────────────────────────┘
```

## 🔄 Build Process

### Landing (Estático)

```
┌───────────────┐
│ Dockerfile    │
└───────┬───────┘
        │
┌───────▼───────┐
│ nginx:alpine  │
└───────┬───────┘
        │
┌───────▼───────────────┐
│ COPY index.html → /usr/share/nginx/html/  │
│ COPY nginx-landing.conf → /etc/nginx/     │
└───────┬───────────────┘
        │
┌───────▼───────┐
│ Image ready   │
└───────────────┘
```

### Demo (Multi-stage)

```
STAGE 1 (Builder)
┌───────────────┐
│ node:18-alpine│
└───────┬───────┘
        │
┌───────▼───────┐
│ npm install   │
└───────┬───────┘
        │
┌───────▼───────┐
│ npm run build │
└───────┬───────┘
        │
    ┌───▼───┐
    │ /build│
    └───┬───┘
        │
STAGE 2 (Runner)
┌───────▼───────┐
│ nginx:alpine  │
└───────┬───────┘
        │
┌───────▼───────────────┐
│ COPY --from=builder   │
│ /app/build → /usr/share/nginx/html/  │
└───────┬───────────────┘
        │
┌───────▼───────┐
│ Image ready   │
└───────────────┘
```

## 🚀 Deployment Flow

```
┌──────────────┐
│  Git Push    │
│  to main     │
└──────┬───────┘
       │
┌──────▼───────────┐
│  GitHub Actions  │  (opcional)
│  • Test build    │
│  • SSH to server │
└──────┬───────────┘
       │
┌──────▼──────────────┐
│  Server             │
│  git pull           │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  ./deploy.sh        │
│  • docker build     │
│  • docker up -d     │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Health checks      │
│  • Container status │
│  • HTTP responses   │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Live! ✓            │
└─────────────────────┘
```

## 📈 Scaling Options

### Horizontal Scaling
```yaml
demo:
  deploy:
    replicas: 3
  # Nginx load balances entre réplicas
```

### Load Balancing
```nginx
upstream demo_app {
    server demo1:80;
    server demo2:80;
    server demo3:80;
    least_conn;
}
```

### Database (futuro)
```
┌────────────────────────────────┐
│  + PostgreSQL Container        │
│  + Redis Cache                 │
│  + Persistent volumes          │
└────────────────────────────────┘
```

## 🛡️ Security Layers

```
┌─────────────────────────────────────┐
│ 1. Network: Firewall (ufw)          │
│    - Solo 80, 443, 22 abiertos      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 2. Nginx: Rate limiting             │
│    - 10 req/s por IP                │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 3. SSL/TLS: HTTPS obligatorio       │
│    - HSTS headers                   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 4. Headers: Security headers        │
│    - X-Frame-Options                │
│    - X-Content-Type-Options         │
│    - CSP (futuro)                   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 5. Containers: Isolated network     │
│    - No external access to backends │
└─────────────────────────────────────┘
```

## 📊 Monitoring Points

```
┌─────────────────────────────────────┐
│ Container Health                    │
│ • docker-compose ps                 │
│ • Healthcheck endpoints             │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Nginx Logs                          │
│ • /var/log/nginx/access.log         │
│ • /var/log/nginx/error.log          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ SSL Expiry                          │
│ • Certbot auto-renewal              │
│ • Manual check via openssl          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ System Resources                    │
│ • docker stats                      │
│ • Server disk/memory/CPU            │
└─────────────────────────────────────┘
```

---

**MedPrec** - Arquitectura robusta y escalable 🏗️
