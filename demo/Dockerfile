# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci || npm install

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar archivos build
COPY --from=builder /app/build /usr/share/nginx/html/

# Copiar configuración nginx personalizada
COPY nginx-demo.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
