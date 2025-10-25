# 🔐 Configuración SSL - MedPrec

## Obtener Certificados SSL de Let's Encrypt

### Requisitos Previos

1. **Servidor con IP pública** accesible desde internet
2. **DNS configurados** apuntando a tu servidor:

```
Tipo    Nombre              Valor
────    ──────              ─────
A       medprec.com         TU_IP_PUBLICA
A       www.medprec.com     TU_IP_PUBLICA
A       app.medprec.com     TU_IP_PUBLICA
```

3. **Puertos abiertos**:
   - Puerto 80 (HTTP) - Requerido para validación
   - Puerto 443 (HTTPS) - Para el servicio final

### Obtener Certificados

**Un solo comando:**

```bash
make ssl-init
```

El script te pedirá:
1. Tu email (para notificaciones de expiración)
2. Confirmación de que los DNS están configurados

**Ejemplo:**

```bash
$ make ssl-init

🔐 Configurando SSL con Let's Encrypt para MedPrec...

📧 Email para notificaciones de Let's Encrypt: admin@tuempresa.com

⚠️  IMPORTANTE: Verifica que tus DNS estén configurados:

   Dominio              Tipo    Apunta a
   ─────────────────    ────    ─────────────
   medprec.com          A       45.123.456.78
   www.medprec.com      A       45.123.456.78
   app.medprec.com      A       45.123.456.78

¿Los DNS están configurados correctamente? (s/n): s

🚀 Iniciando servicios para validación...
📜 Solicitando certificados de Let's Encrypt...
   → Obteniendo certificado para medprec.com...
   → Obteniendo certificado para app.medprec.com...

✅ ¡Certificados SSL obtenidos exitosamente!
```

### Iniciar Servicios

Una vez obtenidos los certificados:

```bash
docker compose up -d
```

O usando el Makefile:

```bash
make prod
```

### Verificar Certificados

```bash
# Ver certificados instalados
docker compose exec nginx ls -la /etc/nginx/ssl/

# Verificar configuración de Nginx
docker compose exec nginx nginx -t

# Ver logs
docker compose logs nginx
```

### Renovación Automática

Los certificados se renuevan automáticamente cada 12 horas gracias al servicio `certbot` en el docker-compose.

**Renovación manual:**

```bash
make ssl-renew
```

## Solución de Problemas

### DNS no configurado

```
❌ Error: DNS verification failed
```

**Solución:**
1. Verifica que los registros DNS estén activos:
   ```bash
   nslookup medprec.com
   nslookup app.medprec.com
   ```
2. Espera a que se propaguen los DNS (puede tomar hasta 48h)
3. Vuelve a ejecutar `make ssl-init`

### Puerto 80 en uso

```
❌ Error: Port 80 already in use
```

**Solución:**
```bash
# Ver qué proceso usa el puerto 80
sudo lsof -i :80

# Detener el servicio (ejemplo con Apache)
sudo systemctl stop apache2
```

### Certificados expirados

Los certificados de Let's Encrypt duran 90 días. La renovación es automática, pero si falla:

```bash
# Renovar manualmente
make ssl-renew

# Reiniciar Nginx
docker compose restart nginx
```

### Verificar expiración

```bash
docker compose exec nginx openssl x509 -in /etc/nginx/ssl/medprec.com/fullchain.pem -noout -dates
```

## Arquitectura SSL

```
Internet (Puerto 80/443)
         │
         ├─→ Nginx (Reverse Proxy)
         │   └─→ SSL Termination
         │       ├─→ Certificado medprec.com (Let's Encrypt)
         │       └─→ Certificado app.medprec.com (Let's Encrypt)
         │
         ├─→ Landing Container (HTTP interno puerto 80)
         └─→ Demo Container (HTTP interno puerto 80)
```

## Comandos Útiles

```bash
# Obtener certificados SSL
make ssl-init

# Renovar certificados
make ssl-renew

# Ver logs de renovación
docker compose logs certbot

# Testear configuración Nginx
make test-nginx

# Ver todos los comandos
make help
```

## Seguridad

✅ **Lo que hace automáticamente el script:**
- Certificados SSL válidos de Let's Encrypt
- TLS 1.2 y 1.3 habilitados
- Headers de seguridad configurados
- Renovación automática
- Rate limiting activo

⚠️ **Recomendaciones adicionales:**
- Habilita HSTS (ya configurado, solo descomenta en nginx.conf)
- Configura firewall (UFW o iptables)
- Monitorea logs de acceso
- Actualiza regularmente las imágenes Docker

## FAQ

**¿Cuánto cuestan los certificados?**
- Gratis. Let's Encrypt es completamente gratuito.

**¿Cuánto duran?**
- 90 días, pero se renuevan automáticamente.

**¿Puedo usar dominios diferentes?**
- Sí, edita el archivo `scripts/setup-ssl.sh` con tus dominios.

**¿Funciona con subdominios?**
- Sí, puedes agregar más subdominios al script.

**¿Qué pasa si falla la renovación?**
- Recibirás un email de Let's Encrypt avisándote.
- Ejecuta `make ssl-renew` manualmente.

---

**¿Problemas?** Revisa los logs: `make logs-nginx` o `docker compose logs certbot`
