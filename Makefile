.DEFAULT_GOAL := help

.PHONY: help network up up-build down build logs ps

help: ## Show available commands
	@grep -E '^[a-zA-Z_%-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "%-16s %s\n", $$1, $$2}'

network: ## Create the shared Docker network if it does not exist
	@docker network inspect mediavault >/dev/null 2>&1 || docker network create mediavault

up: ## Start the application in the background
	docker compose up -d

up-build: ## Build images and start the application in the background
	docker compose up --build -d

down: ## Stop and remove containers
	docker compose down

build: ## Build application images
	docker compose build

logs: ## Follow logs from all services
	docker compose logs --follow

logs-%: ## Follow logs for a service (e.g. make logs-frontend; services: frontend)
	docker compose logs --follow $*

ps: ## Show service status
	docker compose ps
