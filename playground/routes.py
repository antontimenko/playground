from aiohttp import web

from playground.apps.graphql.views import graphql_view
from playground.views import index
from playground.views import random_text


def setup_routes(app: web.Application) -> None:
    app.add_routes((
        web.get('/api', index),
        web.view('/api/graphql', graphql_view, name='graphql'),
        web.get('/api/random-text', random_text, name='random_text'),
    ))
