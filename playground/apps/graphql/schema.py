import graphene

from playground.apps.graphql.queries.random import RandomStringQuery


class Query(
    RandomStringQuery,
    graphene.ObjectType,
):
    pass


schema = graphene.Schema(query=Query)
