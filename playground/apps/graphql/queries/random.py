import random

import graphene


class RandomStringQuery(graphene.ObjectType):
    random_text = graphene.String()

    async def resolve_random_text(self, info):
        random_number = random.randrange(0x100000000)
        return f'{random_number:x}'.upper()
