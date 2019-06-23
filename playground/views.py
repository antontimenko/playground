import random

from aiohttp import web


async def index(request):
    return web.Response(text='haha')


async def random_text(request):
    number = random.randrange(0x100000000)
    text = f'{number:x}'.upper()

    return web.json_response({'text': text})
