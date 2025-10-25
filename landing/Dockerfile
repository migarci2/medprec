FROM nginx:alpine

# Copiar configuración nginx primero
COPY nginx-landing.conf /etc/nginx/conf.d/default.conf

# Copiar archivos de la landing page
COPY index.html /usr/share/nginx/html/
COPY medprec.ico /usr/share/nginx/html/
COPY MedPrec.mp4 /usr/share/nginx/html/

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
