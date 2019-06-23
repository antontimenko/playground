from aiohttp import web

from playground.routes import setup_routes


def main():
    app = web.Application()
    setup_routes(app)
    web.run_app(app, port=8002)
