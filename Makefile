.PHONY: help init dev prod build up down logs clean ssl-init ssl-renew ssl-setup

help: ## Mostrar esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Inicialización
init: ## Inicializar entorno de desarrollo (primera vez)
	@bash scripts/init-dev.sh

# Desarrollo
dev: ## Iniciar en modo desarrollo (sin SSL)
	@bash scripts/init-dev.sh
	docker compose -f docker-compose.dev.yaml up --build

dev-d: ## Iniciar en modo desarrollo en background
	docker compose -f docker-compose.dev.yaml up -d --build

dev-down: ## Detener desarrollo
	docker compose -f docker-compose.dev.yaml down

# Producción
prod: ssl-check ## Iniciar en modo producción (con SSL)
	docker compose up -d --build

ssl-check: ## Verificar y generar certificados SSL si no existen
	@if [ ! -f ssl/medprec.com/fullchain.pem ]; then \
		echo "⚠️  Certificados SSL no encontrados. Generando certificados autofirmados..."; \
		$(MAKE) ssl-dev; \
	fi

build: ## Construir imágenes
	docker compose build

up: ## Iniciar servicios
	docker compose up -d

down: ## Detener servicios
	docker compose down

restart: ## Reiniciar servicios
	docker compose restart

# Logs
logs: ## Ver logs de todos los servicios
	docker compose logs -f

logs-nginx: ## Ver logs de Nginx
	docker compose logs -f nginx

logs-demo: ## Ver logs de Demo
	docker compose logs -f demo

logs-landing: ## Ver logs de Landing
	docker compose logs -f landing

# SSL
ssl-setup: ## Configurar certificados SSL (interactivo)
	@bash scripts/setup-ssl.sh

ssl-init: ## Inicializar certificados SSL con Let's Encrypt
	@echo "Obteniendo certificados SSL..."
	docker compose run --rm certbot certonly --webroot \
		--webroot-path=/var/www/certbot \
		--email hello@medprec.com \
		--agree-tos \
		--no-eff-email \
		-d medprec.com \
		-d www.medprec.com \
		-d app.medprec.com

ssl-renew: ## Renovar certificados SSL
	docker compose run --rm certbot renew

ssl-dev: ## Generar certificados autofirmados para desarrollo
	@mkdir -p ssl/medprec.com ssl/app.medprec.com
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/medprec.com/privkey.pem \
		-out ssl/medprec.com/fullchain.pem \
		-subj "/C=ES/ST=Madrid/L=Madrid/O=MedPrec Dev/CN=localhost"
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/app.medprec.com/privkey.pem \
		-out ssl/app.medprec.com/fullchain.pem \
		-subj "/C=ES/ST=Madrid/L=Madrid/O=MedPrec Dev/CN=localhost"
	@echo "✅ Certificados autofirmados generados"

# Mantenimiento
clean: ## Limpiar contenedores, volúmenes e imágenes
	docker compose down -v
	docker system prune -f

clean-all: ## Limpiar todo (incluyendo imágenes)
	docker compose down -v --rmi all
	docker system prune -af

status: ## Ver estado de los contenedores
	docker compose ps

health: ## Ver health checks
	docker compose ps --format json | jq -r '.[] | "\(.Name): \(.Health)"'

# Testing
test-nginx: ## Testear configuración de Nginx
	docker compose exec nginx nginx -t

reload-nginx: ## Recargar configuración de Nginx
	docker compose exec nginx nginx -s reload

# Acceso rápido
shell-nginx: ## Acceder al shell de Nginx
	docker compose exec nginx sh

shell-demo: ## Acceder al shell de Demo
	docker compose exec demo sh

shell-landing: ## Acceder al shell de Landing
	docker compose exec landing sh
