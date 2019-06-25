# Python + React + SSR playground

This is a sample project, which can be used as a starting point to create web applications using this stack of technologies:

- Python
  - [aiohttp](https://github.com/aio-libs/aiohttp) as an api backend
  - [graphene](https://github.com/graphql-python/graphene) to build GraphQL API
  - [aiohttp-graphql](https://github.com/graphql-python/aiohttp-graphql) to use graphene in aiohttp
  - [mypy](https://github.com/python/mypy) for static type checking
  - [flake8](https://github.com/pycqa/flake8/) for linting
- Javascript
  - [webpack](https://github.com/webpack/webpack) to bundle frontend code
  - [express](https://github.com/expressjs/expressjs.com) as a SSR backend
  - [react](https://github.com/facebook/react/) to build user interfaces
  - [react-router](https://github.com/ReactTraining/react-router) to setup routing
  - [react-helmet](https://github.com/nfl/react-helmet) to manage SEO things using SSR
  - [graphql-hooks](https://github.com/nearform/graphql-hooks) as a GraphQL JS client
  - [ajax-hooks]() as a simple HTTP JS client
  - [eslint](https://github.com/eslint/eslint) for linting
- [nginx](https://github.com/nginx/nginx) as a reverse proxy to API and SSR backends
- Docker and docker-compose to setup development environment
- Makefile to make long docker-compose commands easier to use

## How to use

To build and run project simply do `make run` in project folder. Then navigate to `localhost:8000`. There is a page with a set of buttons, that shows different configurations of HTTP and GraphQL requests working on both SSR and frontend side

## What's inside

On the python side there is a simple `aiohttp` app with two endpoints, one just returning JSON with a random string, and the second one is graphql API with a single query, also returning random string. Also there is a [graphiql](https://github.com/graphql/graphiql) view awailable if you open `http://localhost:8000/api/graphql` in browser. This app runs in `api` container on port `8002`

On the JS side everything is more interesting: there is a SSR express server, running in `ssr` container on port `8003` and a webpack dev server running in `frontend` container on port `8001`.

SSR server is a main part of application, because browser requests are proxied directly to it.
- It renders whole `React` page depending on url (using `react-router`)
- Performs all of the required HTTP and GraphQL requests to Python API (also dumping `ajax-hooks` and `graphql-hooks` cache states to JS variables in html)
- Sets meta information to `<head>` html tag using `react-helmet`
- Sets the appropriate HTTP status code (using `setPageStatus` function).
- When there is redirect from `react-router`'s `<Redirect>`, is sets 302 status code and appropriate `Location` HTTP header
- Adds `main.js` script to page (which is a webpack bundled application)

After resulting page loads in browser, the frontend part comes in
- `graphql-hooks` and `ajax-hooks` clients are setuped using the saved cache state from SSR
- Frontend app is loaded to `<div id="root"></div>` using `ReactDOM.hydrate`

There is also a Nginx server, which is working at main port `8000`. It is needed to just proxy all the requests to SSR server, except ones to `/api/*` urls, which are proxied to Python API, so we can work with both servers on the same domain and port and do not care about Cross Origin Policies

## Linting

You can run `mypy`, `flake8` and `eslint` using
```
make mypy
make flake8
make eslint
```
or simply
```
make lint
```

## Customizing

If you want to add some JS package to project, simply do:
```
docker-compose run --rm yarn add <package>
```

If you want to add some Python package to project, simply put package and dependencies to `requirements.txt`. You can use
```
docker-compose run --rm pip install <package>
```

to see what dependencies you need to add
