# 🎯 GUÍA RÁPIDA - SSL con Let's Encrypt

## Configuración en 3 Pasos

### 1️⃣ Configurar DNS

En tu proveedor de DNS (Cloudflare, Namecheap, GoDaddy, etc.):

```
Tipo A:  medprec.com      → IP_DE_TU_SERVIDOR
Tipo A:  www.medprec.com  → IP_DE_TU_SERVIDOR  
Tipo A:  app.medprec.com  → IP_DE_TU_SERVIDOR
```

**Verificar:**
```bash
nslookup medprec.com
nslookup app.medprec.com
```

### 2️⃣ Obtener Certificados SSL

```bash
make ssl-init
```

**El script te preguntará:**
- ✉️ Tu email (para notificaciones)
- ✅ Confirmación de DNS configurado

**Eso es todo.** Let's Encrypt validará tu dominio y emitirá los certificados.

### 3️⃣ Iniciar Servicios

```bash
make prod
```

**Listo! Accede a:**
- ✅ https://medprec.com
- ✅ https://app.medprec.com

---

## 🔄 Renovación Automática

Los certificados se renuevan automáticamente cada 12 horas.

**Renovación manual:**
```bash
make ssl-renew
```

---

## 📋 Otros Comandos

```bash
make logs        # Ver logs
make status      # Ver estado
make restart     # Reiniciar
make down        # Detener
make help        # Ver todos los comandos
```

---

## ❓ FAQ

**¿Cuesta dinero?**  
No, Let's Encrypt es 100% gratis.

**¿Cuánto duran los certificados?**  
90 días, pero se renuevan automáticamente.

**¿Qué pasa si mi DNS no está listo?**  
El script fallará y te dirá que configures el DNS primero.

**¿Puedo usar otros dominios?**  
Sí, edita `scripts/setup-ssl.sh` línea 47-55.

---

**📖 Documentación completa:** `SSL_SETUP.md`
