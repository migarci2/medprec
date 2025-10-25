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
prod: ## Iniciar en modo producción (con SSL)
	@if [ ! -f ssl/medprec.com/fullchain.pem ]; then \
		echo "⚠️  Certificados SSL no encontrados."; \
		echo ""; \
		echo "Por favor ejecuta primero:"; \
		echo "  make ssl-init"; \
		echo ""; \
		exit 1; \
	fi
	docker compose up -d --build

prod-with-renew: ## Iniciar en producción con renovación automática de SSL
	@if [ ! -f ssl/medprec.com/fullchain.pem ]; then \
		echo "⚠️  Certificados SSL no encontrados."; \
		echo ""; \
		echo "Por favor ejecuta primero:"; \
		echo "  make ssl-init"; \
		echo ""; \
		exit 1; \
	fi
	docker compose --profile certbot up -d --build

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
ssl-init: ## Obtener certificados SSL con Let's Encrypt
	@bash scripts/setup-ssl.sh

ssl-renew: ## Renovar certificados SSL manualmente
	docker run --rm \
		-v "$(PWD)/ssl:/etc/letsencrypt" \
		-v "$(PWD)/certbot/www:/var/www/certbot" \
		certbot/certbot renew
	@docker compose exec nginx nginx -s reload 2>/dev/null || echo "Reinicia nginx con: make reload-nginx"

ssl-status: ## Ver estado de los certificados SSL
	@if [ -f ssl/live/medprec.com/fullchain.pem ]; then \
		echo "📜 Certificados encontrados:"; \
		docker run --rm -v "$(PWD)/ssl:/etc/letsencrypt" certbot/certbot certificates; \
	else \
		echo "❌ No hay certificados SSL instalados."; \
		echo "Ejecuta: make ssl-init"; \
	fi

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
