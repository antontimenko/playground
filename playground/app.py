from aiohttp import web

from playground.routes import setup_routes


app = web.Application()
setup_routes(app)


def run() -> None:
    web.run_app(app, port=8002)
