from aiohttp_graphql import GraphQLView
from graphql.execution.executors.asyncio import AsyncioExecutor

from playground.apps.graphql.schema import schema


graphql_view = GraphQLView(
    schema=schema,
    graphiql=True,
    executor=AsyncioExecutor(),
)
