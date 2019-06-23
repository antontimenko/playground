BASE_APPS=nginx api frontend ssr

_TRAP=trap 'docker-compose down; exit 0' EXIT &&

all: build run

build:
	docker-compose build $(BASE_APPS)

run:
	$(_TRAP) docker-compose up $(BASE_APPS)

down:
	docker-compose down
