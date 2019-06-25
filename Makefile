BASE_APPS=nginx api frontend ssr

_TRAP=trap 'docker-compose down; exit 0' EXIT &&

all: build run

build:
	docker-compose build $(BASE_APPS)

build_all:
	docker-compose build

run:
	$(_TRAP) docker-compose up $(BASE_APPS)

down:
	docker-compose down

flake8:
	docker-compose build flake8 && docker-compose run --rm flake8

mypy:
	docker-compose build mypy && docker-compose run --rm mypy

eslint:
	docker-compose build eslint && docker-compose run --rm eslint

lint: flake8 mypy eslint
